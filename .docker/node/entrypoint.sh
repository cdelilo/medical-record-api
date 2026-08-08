#!/bin/bash
set -e

npm install
npm run migration:run
exec npm run dev
