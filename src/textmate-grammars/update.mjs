import { writeFile } from "node:fs/promises";

const grammar = await fetch(
  "https://github.com/nvarner/typst-lsp/raw/master/editors/vscode/typst.tmLanguage.json"
).then((x) => x.json());

grammar.patterns[0].include = "#code";
grammar.scopeName = "source.typst-code";
grammar.name = "typst-code";
grammar.id = "typst-code";
grammar.aliases = ["typc"];
grammar.fileTypes = ["typc"];

await writeFile(
  `${import.meta.dirname}/typst-code.json`,
  JSON.stringify(grammar, null, 2)
);
