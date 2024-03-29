import { Project, SourceFile } from "@atproto/lex-cli/node_modules/ts-morph";
import { GeneratedFile } from "@atproto/lex-cli/src/types";
import prettier from "prettier";

export const utilTs = (project: Project) =>
  gen(project, "/util.ts", async (file) => {
    file.replaceWithText(`
  export function isObj(v: unknown): v is Record<string, unknown> {
    return typeof v === 'object' && v !== null
  }
  
  export function hasProp<K extends PropertyKey>(
    data: object,
    prop: K,
  ): data is Record<K, unknown> {
    return prop in data
  }
  `);
  });

export async function gen(
  project: Project,
  path: string,
  gen: (file: SourceFile) => Promise<void>
): Promise<GeneratedFile> {
  const file = project.createSourceFile(path);
  await gen(file);
  file.saveSync();
  const src = project.getFileSystem().readFileSync(path);
  return {
    path: path,
    content: `${banner()}${await prettier.format(src, {
      parser: "babel-ts",
    })}`,
  };
}

function banner() {
  return `/**
 * GENERATED CODE - DO NOT MODIFY
 */
`;
}
