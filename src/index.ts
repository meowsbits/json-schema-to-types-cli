#!/usr/bin/env node

import { JsonSchemaToTypes } from "@etclabscore/json-schema-to-types";
import { JSONSchema } from "@open-rpc/meta-schema";

const { program } = require('commander');
const fs = require('fs');

program.version("0.0.1");
program.option("-l, --language <lang>", "transpilation target language" )
program.option("-v, --verbose", "verbose logging");
program.parse(process.argv);

// Get either stdin or first argument.
// https://gist.github.com/ishu3101/9fa58ca1440f780d6288
var args = program.args; // process.argv.slice(2);
var input = args[0];
var isTTY = process.stdin.isTTY;
var stdin = process.stdin;
var stdout = process.stdout;

// If no STDIN and no arguments, display usage message
if (isTTY && args.length === 0) {
    program.help();
}
// If no STDIN but arguments given
else if (isTTY && args.length !== 0) {
    handleShellArguments();
}
// read from STDIN
else {
    handlePipedContent();
}

function handlePipedContent() {
    var data = '';
    stdin.on('readable', function() {
        var chuck = stdin.read();
        if(chuck !== null){
            data += chuck;
        }
    });
    stdin.on('end', function() {
        handleData(data);
    });
}

function handleShellArguments(){
    let rawData = fs.readFileSync(input);
    handleData(rawData);
}

function handleData(input: string) {
  if (input === "") {
    process.exit(2);
  }

  const s = JSON.parse(input) as JSONSchema;
  const transpiler = new JsonSchemaToTypes(s);

    if (typeof(program.language) === "undefined" || program.language === "") {
        console.log("missing language target option");
        program.help();
        process.exit(2);
    }

    const target = program.language;
    if (target === "rs") {
        console.log(transpiler.toRust());
    } else if (target === "go") {
        console.log(transpiler.toGo());
    }  else if (target === "ts") {
        console.log(transpiler.toTypescript());
    }  else if (target === "py") {
        console.log(transpiler.toPython());
    } else {
        console.log("invalid language target");
        program.help();
        process.exit(2);
    }
}

