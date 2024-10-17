/// <reference types="vite/client" />

export interface FilePickerOptions {
  suggestedName?: string;
  types?: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
}

declare global {
  interface Window {
    showSaveFilePicker: (options?: FilePickerOptions) => Promise<FileSystemFileHandle>;
  }
}