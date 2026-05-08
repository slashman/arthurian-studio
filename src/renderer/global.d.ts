export interface ElectronAPI {
  saveData: (filePath: string, data: any) => Promise<boolean>;
  loadFile: (filePath: string) => Promise<string | null>;
  listFiles: (dirPath: string) => Promise<string[]>;
  runProject: (projectDir: string, runtimeCode?: string) => Promise<boolean>;
  getTemplates: () => Promise<{ templates: { name: string; directory: string; code: string; version: string }[] }>;
  getRuntimes: () => Promise<{ runtimes: { name: string; directory: string; code: string; version: string }[] }>;
  createProject: (name: string, templateDir: string, runtimeCode: string) => Promise<string | null>;
  openProject: (filePath?: string) => Promise<any | null>;
  onMenuAction: (callback: (action: string) => void) => (() => void);
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
