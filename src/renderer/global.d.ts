export interface ElectronAPI {
  openProject: () => Promise<any>;
  saveData: (filePath: string, data: any) => Promise<boolean>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
