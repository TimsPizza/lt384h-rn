export type TCmdDicItem = {
  name: string;
  parameters: string[];
  checkSum: string;
};
export type TCmdBase = {
  commandHead: string;
  byteCount: string;
  commandWord0: string;
  commandWord1: string;
  operationWord: string;
  parameters: string[];
  checksum: string;
  commandTail: string[];
};
export const defaultHeatModeSetCmd: TCmdBase = {
  commandHead: '0xAA',
  byteCount: '0x05',
  commandWord0: '0x00',
  commandWord1: '0x2D',
  operationWord: '0x01',
  parameters: [],
  checksum: '',
  commandTail: ['0xEB', '0xAA'],
};

export const defaultImageFilterSetCmd: TCmdBase = {
  commandHead: '0xAA',
  byteCount: '0x05',
  commandWord0: '0x00',
  commandWord1: '0x31',
  operationWord: '0x01',
  parameters: [],
  checksum: '',
  commandTail: ['0xEB', '0xAA'],
};

export const defaultOSDOnOffSetCmd: TCmdBase = {
  commandHead: '0xAA',
  byteCount: '0x05',
  commandWord0: '0x07',
  commandWord1: '0x00',
  operationWord: '0x01',
  parameters: [],
  checksum: '',
  commandTail: ['0xEB', '0xAA'],
};

export const defaultTempUnitSetCmd: TCmdBase = {
  commandHead: '0xAA',
  byteCount: '0x05',
  commandWord0: '0x07',
  commandWord1: '0x02',
  operationWord: '0x01',
  parameters: [],
  checksum: '',
  commandTail: ['0xEB', '0xAA'],
};

export const defaultManualNucCmd: TCmdBase = {
  commandHead: '0xAA',
  byteCount: '0x05',
  commandWord0: '0x00',
  commandWord1: '0x16',
  operationWord: '0x01',
  parameters: [],
  checksum: '',
  commandTail: ['0xEB', '0xAA'],
};

export const defaultSaveSettingsCmd: TCmdBase = {
  commandHead: '0xAA',
  byteCount: '0x04',
  commandWord0: '0x00',
  commandWord1: '0x11',
  operationWord: '0x01',
  parameters: [],
  checksum: '',
  commandTail: ['0xEB', '0xAA'],
};

export const defaultSetContrastCmd: TCmdBase = {
  commandHead: '0xAA',
  byteCount: '0x05',
  commandWord0: '0x00',
  commandWord1: '0x3B',
  operationWord: '0x01',
  parameters: [],
  checksum: '', // NEED TO CALCULATE
  commandTail: ['0xEB', '0xAA'],
};

export const defaultSetBrightnessCmd: TCmdBase = {
  commandHead: '0xAA',
  byteCount: '0x06',
  commandWord0: '0x00',
  commandWord1: '0x3C',
  operationWord: '0x01',
  parameters: [],
  checksum: '', // NEED TO CALCULATE
  commandTail: ['0xEB', '0xAA'],
};

export const defaultsetAGCModeCmd: TCmdBase = {
  commandHead: '0xAA',
  byteCount: '0x05',
  commandWord0: '0x00',
  commandWord1: '0x3A',
  operationWord: '0x01',
  parameters: [],
  checksum: '',
  commandTail: ['0xEB', '0xAA'],
};

export const defaultsetDDEOnOffCmd: TCmdBase = {
  commandHead: '0xAA',
  byteCount: '0x05',
  commandWord0: '0x00',
  commandWord1: '0x3E',
  operationWord: '0x01',
  parameters: [],
  checksum: '',
  commandTail: ['0xEB', '0xAA'],
};

export const defaultsetDDEValueCmd: TCmdBase = {
  commandHead: '0xAA',
  byteCount: '0x05',
  commandWord0: '0x00',
  commandWord1: '0x3F',
  operationWord: '0x01',
  parameters: [],
  checksum: '',
  commandTail: ['0xEB', '0xAA'],
};

export const defaultsetTSSValueCmd: TCmdBase = {
  commandHead: '0xAA',
  byteCount: '0x05',
  commandWord0: '0x07',
  commandWord1: '0xF0',
  operationWord: '0x01',
  parameters: [],
  checksum: '',
  commandTail: ['0xEB', '0xAA'],
};

export const setTSSValueModes: TCmdDicItem[] = [
  {name: '温宽拉伸关', parameters: ['0x00'], checkSum: '0xA7'},
  {name: '温宽拉伸开', parameters: ['0x01'], checkSum: '0xA8'},
];

export const setDDEValueModes: TCmdDicItem[] = [
  {name: '提交DDE值', parameters: [], checkSum: ''},
];

export const setDDEOnOffModes: TCmdDicItem[] = [
  {name: 'DDE关', parameters: ['0x00'], checkSum: '0xEE'},
  {name: 'DDE开', parameters: ['0x01'], checkSum: '0xEF'},
];

export const setAGCModes: TCmdDicItem[] = [
  {name: 'AGC手动', parameters: ['0x00'], checkSum: '0xEA'},
  {name: 'AGC自动0', parameters: ['0x01'], checkSum: '0xEB'},
  {name: 'AGC自动1', parameters: ['0x02'], checkSum: '0xEC'},
];

export const setBrightnessModes: TCmdDicItem[] = [
  {name: '设置亮度', parameters: [], checkSum: ''},
];

export const setContrastModes: TCmdDicItem[] = [
  {name: '设置对比度', parameters: [], checkSum: ''},
];

export const saveSettingsModes: TCmdDicItem[] = [
  {name: '保存设置', parameters: [], checkSum: '0xC0'},
];

export const manualNucModes: TCmdDicItem[] = [
  {name: 'NUC快门矫正', parameters: ['0x00'], checkSum: '0xC6'},
  {name: 'NUC背景校正', parameters: ['0x02'], checkSum: '0xC8'},
];

export const tempUnitModes: TCmdDicItem[] = [
  {name: '摄氏度', parameters: ['0x00'], checkSum: '0xB9'},
  {name: '开尔文', parameters: ['0x01'], checkSum: '0xBA'},
  {name: '华氏度', parameters: ['0x02'], checkSum: '0xBB'},
];

export const osdOnOffModes: TCmdDicItem[] = [
  {name: 'OSD关', parameters: ['0x00'], checkSum: '0xB7'},
  {name: 'OSD开', parameters: ['0x01'], checkSum: '0xB8'},
];

export const imageFilterModes: TCmdDicItem[] = [
  {name: '图像滤波关', parameters: ['0x00'], checkSum: '0xE1'},
  {name: '图像滤波开', parameters: ['0x01'], checkSum: '0xE2'},
];

export const heatModes: TCmdDicItem[] = [
  {name: '白热', parameters: ['0x00'], checkSum: '0xDD'},
  {name: '黑热', parameters: ['0x01'], checkSum: '0xDE'},
  {name: '蓝红黄', parameters: ['0x02'], checkSum: '0xDF'},
  {name: '紫红黄', parameters: ['0x03'], checkSum: '0xE0'},
  {name: '蓝绿红', parameters: ['0x04'], checkSum: '0xE1'},
  {name: '彩虹1', parameters: ['0x05'], checkSum: '0xE2'},
  {name: '彩虹2', parameters: ['0x06'], checkSum: '0xE3'},
  {name: '黑-红', parameters: ['0x07'], checkSum: '0xE4'},
  {name: '墨绿-红', parameters: ['0x08'], checkSum: '0xE5'},
  {name: '蓝绿红-粉', parameters: ['0x09'], checkSum: '0xE6'},
  {name: '混合色', parameters: ['0x0A'], checkSum: '0xE7'},
  {name: '警示红', parameters: ['0x0B'], checkSum: '0xE8'},
  {name: '蓝青橙', parameters: ['0x0C'], checkSum: '0xE9'},
  {name: '蓝紫红', parameters: ['0x0D'], checkSum: '0xEA'},
  {name: '红黄', parameters: ['0x0E'], checkSum: '0xEB'},
  {name: '蓝红', parameters: ['0x0F'], checkSum: '0xEC'},
  {name: '蓝青灰', parameters: ['0x10'], checkSum: '0xED'},
  {name: '橙红黄', parameters: ['0x11'], checkSum: '0xEE'},
  {name: '警示绿', parameters: ['0x12'], checkSum: '0xEF'},
  {name: '警示蓝', parameters: ['0x13'], checkSum: '0xF0'},
];
