#!/bin/bash
set -euo pipefail

pushd src/authz/spicedb/schema

echo 'export const spicedbSchema = `' > atproto.ts

zed preview schema compile atproto.zed --out compiled.zed
cat compiled.zed >> atproto.ts
rm compiled.zed

echo '`;' >> atproto.ts

