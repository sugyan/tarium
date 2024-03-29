import {
  IndentationText,
  Project,
  SourceFile,
} from "@atproto/lex-cli/node_modules/ts-morph";
import {
  genImports,
  genObjHelpers,
  genObject,
  genUserType,
  genXrpcInput,
  genXrpcOutput,
  genXrpcParams,
} from "@atproto/lex-cli/src/codegen/lex-gen";
import { GeneratedAPI } from "@atproto/lex-cli/src/types";
import { LexiconDoc, Lexicons } from "@atproto/lexicon";
import { gen, utilTs } from "./common";

export async function genTypes(
  lexiconDocs: LexiconDoc[]
): Promise<GeneratedAPI> {
  const project = new Project({
    useInMemoryFileSystem: true,
    manipulationSettings: { indentationText: IndentationText.TwoSpaces },
  });
  const api: GeneratedAPI = { files: [] };
  const lexicons = new Lexicons(lexiconDocs);
  for (const lexiconDoc of lexiconDocs) {
    api.files.push(await lexiconTs(project, lexicons, lexiconDoc));
  }
  api.files.push(await utilTs(project));
  return api;
}

const lexiconTs = (
  project: Project,
  lexicons: Lexicons,
  lexiconDoc: LexiconDoc
) =>
  gen(
    project,
    `/types/${lexiconDoc.id.split(".").join("/")}.ts`,
    async (file) => {
      const imports: Set<string> = new Set();

      const main = lexiconDoc.defs.main;
      //= import {ValidationResult, BlobRef} from '@atproto/lexicon'
      file
        .addImportDeclaration({
          moduleSpecifier: "@atproto/lexicon",
        })
        .addNamedImports([{ name: "ValidationResult" }, { name: "BlobRef" }]);
      //= import {isObj, hasProp} from '../../util.ts'
      file
        .addImportDeclaration({
          moduleSpecifier: `${lexiconDoc.id
            .split(".")
            .map((_str) => "..")
            .join("/")}/util`,
        })
        .addNamedImports([{ name: "isObj" }, { name: "hasProp" }]);
      //= import {CID} from 'multiformats/cid'
      file
        .addImportDeclaration({
          moduleSpecifier: "multiformats/cid",
        })
        .addNamedImports([{ name: "CID" }]);

      for (const defId in lexiconDoc.defs) {
        const def = lexiconDoc.defs[defId];
        const lexUri = `${lexiconDoc.id}#${defId}`;
        if (defId === "main") {
          if (def.type === "query" || def.type === "procedure") {
            genXrpcParams(file, lexicons, lexUri, false);
            genXrpcInput(file, imports, lexicons, lexUri, false);
            genXrpcOutput(file, imports, lexicons, lexUri);
          } else if (def.type === "subscription") {
            continue;
          } else if (def.type === "record") {
            genClientRecord(file, imports, lexicons, lexUri);
          } else {
            genUserType(file, imports, lexicons, lexUri);
          }
        } else {
          genUserType(file, imports, lexicons, lexUri);
        }
      }
      genImports(file, imports, lexiconDoc.id);
    }
  );

function genClientRecord(
  file: SourceFile,
  imports: Set<string>,
  lexicons: Lexicons,
  lexUri: string
) {
  const def = lexicons.getDefOrThrow(lexUri, ["record"]);

  //= export interface Record {...}
  genObject(file, imports, lexUri, def.record, "Record");
  //= export function isRecord(v: unknown): v is Record {...}
  genObjHelpers(file, lexUri, "Record");
}
