declare module "@react-router/dev" {
  export interface FileRoute {
    path?: string;
    file: string;
    children?: FileRoute[];
  }
}
