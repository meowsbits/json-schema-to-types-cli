# json-schema-to-types-cli

A very tiny CLI wrapper around https://github.com/etclabscore/json-schema-to-types.

Generates code from a json schema. Output is printed to standard out.

Supported target languages include:
- Go: `--language=go`
- Rust: `--language=rs`
- Python: `--language=py`
- Typescript: `--language=ts`

## Usage

Pass a file containing a JSON Schema as the program argument.

```sh
$ json-schema-to-types-cli --language=go schema.json
```

Pass a JSON Schema via a standard input pipe.

```sh
$ cat schema.json | json-schema-to-types-cli --language=rs
```

## Install

```sh
$ git clone https://github.com/etclabscore/json-schema-to-types-cli
$ cd json-schema-to-types-cli
$ npm i && npm link
```

## Examples

[./testdata/type-string.json](./testdata/type-string.json) contains a very simple JSON Schema.

```sh
$ json-schema-to-types-cli --language=go ./testdata/type-string.json
type StringDoaGddGA string
```
