export interface ElectronAPI {
  openProject: () => Promise<any>;
  saveData: (filePath: string, data: any) => Promise<boolean>;
  listFiles: (dirPath: string) => Promise<string[]>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
