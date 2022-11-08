declare interface FileTypes {
    description: string, 
    accept: Record<string, Array<string>>
}

declare interface ShowOpenFilePickerOptions {
    multiple?: boolean;
    excludeAcceptAllOption?: boolean;
    types: Array<FileTypes>;
}

declare interface ShowSaveFilePickerOptions {
    excludeAcceptAllOption?: boolean;
    suggestedName: string;
    types: Array<FileTypes>;
}

declare interface Window {
    showOpenFilePicker(opts?: ShowOpenFilePickerOptions): Promise<Array<FileSystemFileHandle>>;
    showSaveFilePicker(opts?: ShowSaveFilePickerOptions): Promise<FileSystemFileHandle>;
}

declare interface FileSystemFileHandle {
    createWritable(): Promise<FileSystemWritableFileStream>;
}