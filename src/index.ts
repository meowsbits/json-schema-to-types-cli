#!/usr/bin/env node

const {program} = require('commander');
const fs = require('fs');

import {JsonSchemaToTypes} from "@etclabscore/json-schema-to-types";
import {JSONSchema} from "@open-rpc/meta-schema";

program.version("0.0.1");
program.option("-l, --target <target>", "target language")
program.option("-v, --verbose", "verbose logging");
program.parse(process.argv);

let args = program.args;
let input = args[0];
let isTTY = process.stdin.isTTY;
let stdin = process.stdin;

if (isTTY && args.length === 0) {
  program.help();
} else if (isTTY && args.length !== 0) {
  handleShellArguments();
} else {
  handlePipedContent();
}

function handlePipedContent() {
  let data = '';
  stdin.on('readable', function () {
    let chuck = stdin.read();
    if (chuck !== null) {
      data += chuck;
    }
  });
  stdin.on('end', function () {
    handleData(data);
  });
}

function handleShellArguments() {
  let rawData = fs.readFileSync(input);
  handleData(rawData);
}

function handleData(input: string) {
  if (input === "") {
    program.help();
    process.exit(2);
  }

  if (typeof (program.target) === "undefined" || program.target === "") {
    console.log("missing target target option");
    program.help();
    process.exit(2);
  }

  const s = JSON.parse(input) as JSONSchema;
  const transpiler = new JsonSchemaToTypes(s);

  const target = program.target;
  switch (target) {
    case "rs":
      console.log(transpiler.toRust());
      return
    case "go":
      console.log(transpiler.toGo());
      return
    case "ts":
      console.log(transpiler.toTypescript());
      return
    case "py":
      console.log(transpiler.toPython());
      return
    default:
      console.log("invalid target");
      program.help();
      process.exit(2);
  }
}

