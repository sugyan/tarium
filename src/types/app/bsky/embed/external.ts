import { isType } from "../../../utils";

export interface View {
  external: ViewExternal;
}

export function isView(v: unknown): v is View {
  return isType(v, "app.bsky.embed.external#view");
}

export interface ViewExternal {
  uri: string;
  title: string;
  description: string;
  thumb?: string;
}
