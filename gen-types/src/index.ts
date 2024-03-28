import {
  applyFileDiff,
  genFileDiff,
  printFileDiff,
  readAllLexicons,
} from "@atproto/lex-cli/src/util";
import { Command } from "commander";
import path from "path";
import { genTypes } from "./codegen/types";

const program = new Command();
program.name("gen-types").description("Generate Types CLI").version("0.0.0");

program
  .argument("<lexicons...>", "paths of the lexicon files to include", toPaths)
  .action(async (lexiconPaths: string[]) => {
    const outDir = "./tmp/";
    const lexicons = readAllLexicons(lexiconPaths);
    const api = await genTypes(lexicons);
    const diff = genFileDiff(outDir, api);
    console.log("This will write the following files:");
    printFileDiff(diff);
    applyFileDiff(diff);
    console.log("API generated.");
  });

program.parse();

function toPaths(v: string, acc: string[]) {
  acc = acc || [];
  acc.push(path.resolve(v));
  return acc;
}
