export interface ElectronAPI {
  openProject: () => Promise<any>;
  saveData: (filePath: string, data: any) => Promise<boolean>;
  loadFile: (filePath: string) => Promise<string | null>;
  listFiles: (dirPath: string) => Promise<string[]>;
  runProject: (projectDir: string) => Promise<boolean>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
