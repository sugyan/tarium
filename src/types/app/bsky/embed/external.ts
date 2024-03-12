export interface View {
  external: ViewExternal;
}

export interface ViewExternal {
  uri: string;
  title: string;
  description: string;
  thumb?: string;
}
