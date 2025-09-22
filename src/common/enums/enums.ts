export enum TaskStatus {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriority {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

export enum ResultCode {
  Success = 0,
  Error = 1,
  CaptchaError = 10,
}

// Тип, содержащий только числовые значения
export type ResultCodeValue = typeof ResultCode[keyof typeof ResultCode];
