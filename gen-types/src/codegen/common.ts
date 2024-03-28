import { Project, SourceFile } from "@atproto/lex-cli/node_modules/ts-morph";
import { GeneratedFile } from "@atproto/lex-cli/src/types";
import prettier from "prettier";

const PRETTIER_OPTS = {
  parser: "babel-ts",
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  trailingComma: "all" as const,
};

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
    content: `${banner()}${await prettier.format(src, PRETTIER_OPTS)}`,
  };
}

function banner() {
  return `/**
 * GENERATED CODE - DO NOT MODIFY
 */
`;
}
