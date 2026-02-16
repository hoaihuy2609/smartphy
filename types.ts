
export interface SolutionResult {
  latex: string;
  preview: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  SOLVING = 'SOLVING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}
