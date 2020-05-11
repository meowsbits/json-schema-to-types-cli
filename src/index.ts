#!/usr/bin/env node

const {program} = require('commander');
const fs = require('fs');

import {JsonSchemaToTypes} from "@etclabscore/json-schema-to-types";
import {JSONSchema} from "@open-rpc/meta-schema";

program.version("0.0.1");
program.option("-l, --target <target>", "target language [rs|go|ts|py]")
program.option("-v, --verbose", "verbose logging");
program.parse(process.argv);

let args = program.args;
let firstArg = args[0];
let isTTY = process.stdin.isTTY;
let stdin = process.stdin;

if (isTTY && args.length === 0) {
  program.help();
} else if (isTTY && args.length !== 0) {
  handleArguments();
} else {
  handlePipe();
}

function handlePipe() {
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

function handleArguments() {
  let fileData = fs.readFileSync(firstArg);
  handleData(fileData);
}

function exitWithHelp(context:string) {
  if (context.length > 0) {
    console.log("error:", context);
  }
  program.help();
  process.exit(2);
}

function handleData(input: string) {
  if (input.length < 1) {
    exitWithHelp("input was empty");
  }

  if (typeof (program.target) === "undefined" || program.target === "") {
    exitWithHelp("missing target target option");
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
      exitWithHelp("invalid target");
  }
}

