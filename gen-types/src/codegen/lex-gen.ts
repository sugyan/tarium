import { SourceFile } from "@atproto/lex-cli/node_modules/ts-morph";
import {
  genArray,
  genObject,
  genPrimitiveOrBlob,
  genToken,
  getHash,
  stripHash,
} from "@atproto/lex-cli/src/codegen/lex-gen";
import { toCamelCase, toTitleCase } from "@atproto/lex-cli/src/codegen/util";
import { Lexicons } from "@atproto/lexicon";

export function genUserType(
  file: SourceFile,
  imports: Set<string>,
  lexicons: Lexicons,
  lexUri: string
) {
  const def = lexicons.getDefOrThrow(lexUri);
  switch (def.type) {
    case "array":
      genArray(file, imports, lexUri, def);
      break;
    case "token":
      genToken(file, lexUri, def);
      break;
    case "object":
      genObject(file, imports, lexUri, def);
      genObjHelpers(file, lexUri);
      break;

    case "blob":
    case "bytes":
    case "cid-link":
    case "boolean":
    case "integer":
    case "string":
    case "unknown":
      genPrimitiveOrBlob(file, lexUri, def);
      break;

    default:
      throw new Error(
        `genLexUserType() called with wrong definition type (${def.type}) in ${lexUri}`
      );
  }
}

export function genObjHelpers(
  file: SourceFile,
  lexUri: string,
  ifaceName?: string
) {
  const hash = getHash(lexUri);

  //= export function is{X}(v: unknown): v is X {...}
  file
    .addFunction({
      name: toCamelCase(`is-${ifaceName || hash}`),
      parameters: [{ name: `v`, type: `unknown` }],
      returnType: `v is ${ifaceName || toTitleCase(hash)}`,
      isExported: true,
    })
    .setBodyText(
      hash === "main"
        ? `return isObj(v) && hasProp(v, '$type') && (v.$type === "${lexUri}" || v.$type === "${stripHash(
            lexUri
          )}")`
        : `return isObj(v) && hasProp(v, '$type') && v.$type === "${lexUri}"`
    );
}
