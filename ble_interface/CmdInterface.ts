interface Command {
  commandHead: string; // 命令头
  byteCount: string; // 字节数
  commandWord0: string; // 命令字0
  commandWord1: string; // 命令字1
  operationWord: string; // 操作字
  parameters: string[]; // 参数
  checksum: string; // 校验位
  commandTail: string; // 命令尾
}

interface StatusInfo {
  statusHead: string; // 状态信息头
  byteCount: string; // 字节数
  commandWord0: string; // 命令字0
  commandWord1: string; // 命令字1
  operationWord: string; // 操作字
  returnValues: string[]; // 返回值
  checksum: string; // 校验位
  statusTail: string; // 状态信息尾
}

interface ErrorCode {
  returnValue: string; // 返回值
  errorReason: string; // 错误原因
}

// 示例命令
const exampleCommand: Command = {
  commandHead: "0xAA",
  byteCount: '0x05',
  commandWord0: "0x00",
  commandWord1: "0x07",
  operationWord: "0x03",
  parameters: ["0x00", "0x00"],
  checksum: "0xB1",
  commandTail: "0xEB"
};

// 示例状态信息
const exampleStatus: StatusInfo = {
  statusHead: "0x55",
  byteCount: '0x05',
  commandWord0: "0x00",
  commandWord1: "0x07",
  operationWord: "0x33",
  returnValues: ["0x00", "0x02"],
  checksum: "0x93",
  statusTail: "0xEB"
};

// 示例错误代码
const exampleError: ErrorCode = {
  returnValue: "0xF1",
  errorReason: "命令发送超时"
};
