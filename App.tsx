import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  TextInput,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import BleManager, {Peripheral} from 'react-native-ble-manager';
import {
  TCmdBase,
  defaultHeatModeSetCmd,
  defaultImageFilterSetCmd,
  defaultOSDOnOffSetCmd,
  defaultTempUnitSetCmd,
  defaultManualNucCmd,
  defaultSaveSettingsCmd,
  defaultSetContrastCmd,
  defaultSetBrightnessCmd,
  defaultsetAGCModeCmd,
  defaultsetDDEOnOffCmd,
  defaultsetDDEValueCmd,
  defaultsetTSSValueCmd,
  manualNucModes,
  tempUnitModes,
  osdOnOffModes,
  imageFilterModes,
  heatModes,
  saveSettingsModes,
  setContrastModes,
  setBrightnessModes,
  setAGCModes,
  setDDEOnOffModes,
  setDDEValueModes,
  setTSSValueModes,
} from './ble_interface/Lt384Cmd';
import Slider from '@react-native-community/slider';
// import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {styles} from './styles';

type UUID = string;

const TARGET_DEVICE_NAME = 'ESP32_C3_BLE'; // 目标设备名称
const TARGET_DEVICE_SERVICE_UUID = 'faddac67-23b2-4940-bfcf-578e7ca140a2'; // 目标设备服务UUID
const TARGET_DEVICE_CHARACTERISTIC_UUID =
  '249da5e0-4729-4cd1-ab29-869c2169319b'; // 目标设备特征UUID

const requestBluetoothPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    if (
      granted['android.permission.BLUETOOTH_SCAN'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.BLUETOOTH_CONNECT'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.ACCESS_FINE_LOCATION'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('You can use Bluetooth');
    } else {
      console.log('Bluetooth permission denied');
    }
  }
};
const calcCheckSum = (cmd: TCmdBase) => {
  let sum = 0;
  sum += parseInt(cmd.commandHead, 16);
  sum += parseInt(cmd.byteCount, 16);
  sum += parseInt(cmd.commandWord0, 16);
  sum += parseInt(cmd.commandWord1, 16);
  sum += parseInt(cmd.operationWord, 16);
  cmd.parameters.forEach(param => {
    sum += parseInt(param, 16);
  });
  sum %= 256;
  console.log('check sum:', '0x' + sum.toString(16));
  return '0x' + sum.toString(16).toUpperCase();
};

const numberToHexArray = (num: number, reqMinHexBitCount: number = 1) => {
  const hexArray: string[] = [];
  if (num === 0) {
    hexArray.push('0x00');
    if (reqMinHexBitCount > 1) {
      hexArray.push('0x00');
    }
    return hexArray;
  }
  // 每次处理两个字符（1字节）
  while (num > 0) {
    const byte = num & 0xff; // 取出最低的8位
    hexArray.push('0x' + byte.toString(16).padStart(2, '0').toUpperCase()); // 转成16进制并补0
    num = num >> 8; // 向右移8位，处理下一字节
  }
  if (hexArray.length < reqMinHexBitCount) {
    hexArray.push('0x00');
  }
  return hexArray;
};

const App: React.FC = () => {
  const [connectedDeviceId, setConnectedDeviceId] = useState<UUID | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [contrastValue, setContrastValue] = useState(0);
  const [brightnessValue, setBrightnessValue] = useState(0);
  const [ddeValue, setDDEValue] = useState(0);
  const [customizedCmd, setCustomizeCmd] = useState<string>('');
  useEffect(() => {
    requestBluetoothPermission();
    BleManager.start({showAlert: false});
    // 监听扫描结果
    const handleDiscoverPeripheral = (peripheral: Peripheral) => {
      console.log('Discovered peripheral:', peripheral.name);
      // 检查是否是目标设备
      if (peripheral.name === TARGET_DEVICE_NAME) {
        BleManager.stopScan().then(() => {
          console.log('Device detected, scanning stopped. id:', peripheral.id);
        });
        setIsScanning(false);
        setConnectedDeviceId(peripheral.id);
      }
    };

    BleManager.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );

    return () => {
      BleManager.removeAllListeners('BleManagerDiscoverPeripheral');
    };
  }, []);

  const parseCustomizedCmdToHexArray = (cmd: string) => {
    return cmd.split(' ');
  };

  const interruptConnection = async () => {
    if (connectedDeviceId) {
      // BleManager.removeBond(connectedDeviceId);
      console.log('interruptConnection called. id:', connectedDeviceId);
      await BleManager.disconnect(connectedDeviceId, true)
        .then(() => {
          console.log('Disconnected from device', connectedDeviceId);
          // setConnectedDeviceId(null);
          setIsConnected(false);
        })
        .catch(error => {
          console.log('Error disconnecting', error);
        });
    }
    BleManager.getConnectedPeripherals([]).then(peripheralsArray => {
      // It didnt...
      console.log(
        'Connected peripherals after removal: ' + peripheralsArray.length,
      );
    });
    BleManager.getBondedPeripherals().then(peripheralsArray => {
      console.log(
        'Bonded peripherals after removal: ' + peripheralsArray.length,
      );
    });
  };

  const settingButtonOnPress = (
    cmdBase: TCmdBase,
    cmdParam: string[],
    cmdCheckSum: string,
  ) => {
    return () => {
      let data = [
        cmdBase.commandHead,
        cmdBase.byteCount,
        cmdBase.commandWord0,
        cmdBase.commandWord1,
        cmdBase.operationWord,
        ...cmdParam,
        cmdCheckSum,
        ...cmdBase.commandTail,
      ];
      console.log(data);
      let dataU8: number[] = data.map(item => {
        return parseInt(item, 16);
      });
      sendData(dataU8);
    };
  };

  const HeatModeButtons = () => {
    return (
      <>
        {heatModes.map((mode, index) => {
          return (
            <TouchableOpacity
              key={mode.name}
              style={styles.button}
              onPress={settingButtonOnPress(
                defaultHeatModeSetCmd,
                heatModes[index].parameters,
                heatModes[index].checkSum,
              )}>
              <Text>{mode.name}</Text>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  const TempUnitButtons = () => {
    return (
      <>
        {tempUnitModes.map((mode, index) => {
          return (
            <TouchableOpacity
              key={mode.name}
              style={styles.button}
              onPress={settingButtonOnPress(
                defaultTempUnitSetCmd,
                tempUnitModes[index].parameters,
                tempUnitModes[index].checkSum,
              )}>
              <Text>{mode.name}</Text>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  const OSDOnOffButtons = () => {
    return (
      <>
        {osdOnOffModes.map((mode, index) => {
          return (
            <TouchableOpacity
              key={mode.name}
              style={styles.button}
              onPress={settingButtonOnPress(
                defaultOSDOnOffSetCmd,
                osdOnOffModes[index].parameters,
                osdOnOffModes[index].checkSum,
              )}>
              <Text>{mode.name}</Text>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  const ImageFilterButtons = () => {
    return (
      <>
        {imageFilterModes.map((mode, index) => {
          return (
            <TouchableOpacity
              key={mode.name}
              style={styles.button}
              onPress={settingButtonOnPress(
                defaultImageFilterSetCmd,
                imageFilterModes[index].parameters,
                imageFilterModes[index].checkSum,
              )}>
              <Text>{mode.name}</Text>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  const ManualNucButtons = () => {
    return (
      <>
        {manualNucModes.map((mode, index) => {
          return (
            <TouchableOpacity
              key={mode.name}
              style={styles.button}
              onPress={settingButtonOnPress(
                defaultManualNucCmd,
                manualNucModes[index].parameters,
                manualNucModes[index].checkSum,
              )}>
              <Text>{mode.name}</Text>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  const SaveSettingsButtons = () => {
    return (
      <>
        {saveSettingsModes.map((mode, index) => {
          return (
            <TouchableOpacity
              key={mode.name}
              style={styles.button}
              onPress={settingButtonOnPress(
                defaultSaveSettingsCmd,
                saveSettingsModes[index].parameters,
                saveSettingsModes[index].checkSum,
              )}>
              <Text>{mode.name}</Text>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  const SetContrastButtons = () => {
    return (
      <>
        {setContrastModes.map((mode, index) => {
          return (
            <TouchableOpacity
              key={mode.name}
              style={styles.button}
              onPress={() => {
                let newCmd = defaultSetContrastCmd;
                newCmd.parameters = numberToHexArray(contrastValue);
                newCmd.checksum = calcCheckSum(newCmd);
                settingButtonOnPress(
                  newCmd,
                  newCmd.parameters,
                  newCmd.checksum,
                )();
              }}>
              <Text>{mode.name}</Text>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  const SetBrightnessButtons = () => {
    return (
      <>
        {setBrightnessModes.map((mode, index) => {
          return (
            <TouchableOpacity
              key={mode.name}
              style={styles.button}
              onPress={() => {
                let newCmd = defaultSetBrightnessCmd;
                newCmd.parameters = numberToHexArray(brightnessValue, 2);
                newCmd.checksum = calcCheckSum(newCmd);
                settingButtonOnPress(
                  newCmd,
                  newCmd.parameters,
                  newCmd.checksum,
                )();
              }}>
              <Text>{mode.name}</Text>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  const SetAGCModeButtons = () => {
    return (
      <>
        {setAGCModes.map((mode, index) => {
          return (
            <TouchableOpacity
              key={mode.name}
              style={styles.button}
              onPress={settingButtonOnPress(
                defaultsetAGCModeCmd,
                setAGCModes[index].parameters,
                setAGCModes[index].checkSum,
              )}>
              <Text>{mode.name}</Text>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  const SetDDEOnOffButtons = () => {
    return (
      <>
        {setDDEOnOffModes.map((mode, index) => {
          return (
            <TouchableOpacity
              key={mode.name}
              style={styles.button}
              onPress={settingButtonOnPress(
                defaultsetDDEOnOffCmd,
                setDDEOnOffModes[index].parameters,
                setDDEOnOffModes[index].checkSum,
              )}>
              <Text>{mode.name}</Text>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  const SetDDEValueButtons = () => {
    return (
      <>
        {setDDEValueModes.map((mode, index) => {
          return (
            <TouchableOpacity
              key={mode.name}
              style={styles.button}
              onPress={() => {
                let newCmd = defaultsetDDEValueCmd;
                newCmd.parameters = numberToHexArray(ddeValue);
                newCmd.checksum = calcCheckSum(newCmd);
                settingButtonOnPress(
                  newCmd,
                  newCmd.parameters,
                  newCmd.checksum,
                )();
              }}>
              <Text>{mode.name}</Text>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  const SetTSSValueButtons = () => {
    return (
      <>
        {setTSSValueModes.map((mode, index) => {
          return (
            <TouchableOpacity
              key={mode.name}
              style={styles.button}
              onPress={settingButtonOnPress(
                defaultsetTSSValueCmd,
                setTSSValueModes[index].parameters,
                setTSSValueModes[index].checkSum,
              )}>
              <Text>{mode.name}</Text>
            </TouchableOpacity>
          );
        })}
      </>
    );
  }

  const connect = async () => {
    if (connectedDeviceId) {
      await connectDevice(connectedDeviceId);
      console.log('Device connected');
    } else {
      console.log('Device not specified.');
    }
  };

  const scanDevices = () => {
    if (connectedDeviceId) {
      console.log('Device already found.');
    } else if (isScanning) {
      console.log('Scanning in progress...');
    } else {
      console.log('Scanning...');
      setIsScanning(true);
      BleManager.scan([], 0, true);
    }
  };

  const connectDevice = async (id: UUID) => {
    await BleManager.connect(id)
      .then(() => {
        console.log('Connected to', id);
        setIsConnected(true);
        return BleManager.retrieveServices(id);
      })
      .then(peripheralInfo => {
        console.log('Peripheral info acquired');
      })
      .catch(error => {
        console.log('Connection error', error);
      });
  };

  const sendData = (data: number[]) => {
    console.log(`writing data: ${data} to device ${connectedDeviceId}`);
    if (connectedDeviceId) {
      console.log('sending...');
      BleManager.write(
        connectedDeviceId,
        TARGET_DEVICE_SERVICE_UUID,
        TARGET_DEVICE_CHARACTERISTIC_UUID,
        data,
      )
        .then(() => {
          console.log('Data sent.');
        })
        .catch(error => {
          console.log('err catched', error);
        });
    } else {
      console.log('Device not connected.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={{marginStart: 'auto', marginEnd: 'auto'}}>
        {connectedDeviceId}
      </Text>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          // flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignItems: 'center',
          backgroundColor: '#F5FCFF',
          gap: 10,
          width: '100%',
        }}>
        <TouchableOpacity
          style={[
            styles.button,
            connectedDeviceId
              ? styles.buttonFoundDisabled
              : isScanning
              ? styles.buttonScanningDisabled
              : null,
          ]}
          onPress={scanDevices}
          disabled={isScanning || !!connectedDeviceId}>
          <Text>
            {isConnected
              ? '已连接'
              : connectedDeviceId
              ? '已发现'
              : isScanning
              ? '扫描中'
              : '扫描设备'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            isConnected ? styles.buttonFoundDisabled : null,
          ]}
          disabled={isConnected}
          onPress={connect}>
          <Text>{isConnected ? '连接成功' : '连接设备'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            isConnected ? null : styles.buttonForceDisabled,
          ]}
          disabled={!isConnected}
          onPress={interruptConnection}>
          <Text>断开连接</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerInner}>
        <HeatModeButtons />
      </View>
      <View style={[styles.containerInner, styles.containerInnerCentered]}>
        <SaveSettingsButtons />
      </View>
      <View style={[styles.containerInner]}>
        <OSDOnOffButtons />
      </View>
      <View style={styles.containerInner}>
        <ImageFilterButtons />
      </View>
      <View style={styles.containerInner}>
        <ManualNucButtons />
      </View>
      <View style={styles.containerInner}>
        <TempUnitButtons />
      </View>
      <View style={styles.containerInner}>
        <SetAGCModeButtons />
      </View>
      <View style={styles.containerInner}>
        <SetDDEOnOffButtons />
      </View>
      <View style={styles.containerInner}>
        <SetTSSValueButtons />
      </View>

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Slider
          style={{width: 400, height: 40}}
          minimumValue={0}
          maximumValue={255}
          step={1}
          value={contrastValue}
          onValueChange={val => setContrastValue(val)}
          minimumTrackTintColor="#1fb28a"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#b9e4c9"
        />
        <Text>对比度数值: {contrastValue}</Text>
        <SetContrastButtons />
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Slider
          style={{width: 400, height: 40}}
          minimumValue={0}
          maximumValue={511}
          step={1}
          value={brightnessValue}
          onValueChange={val => setBrightnessValue(val)}
          minimumTrackTintColor="#1fb28a"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#b9e4c9"
        />
        <Text>亮度数值: {brightnessValue}</Text>
        <SetBrightnessButtons />
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Slider
          style={{width: 400, height: 40}}
          minimumValue={0}
          maximumValue={7}
          step={1}
          value={ddeValue}
          onValueChange={val => setDDEValue(val)}
          minimumTrackTintColor="#1fb28a"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#b9e4c9"
        />
        <Text>DDE数值: {ddeValue}</Text>
        <SetDDEValueButtons />
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            width: 200,
            padding: 10,
          }}
          placeholder="输入自定义命令"
          value={customizedCmd}
          onChangeText={text => setCustomizeCmd(text)}
        />
        <Text>自定义命令: {customizedCmd}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            let cmdArray = parseCustomizedCmdToHexArray(customizedCmd);
            sendData(cmdArray.map(item => parseInt(item, 16)));
          }}>
          <Text>发送自定义命令</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default App;
