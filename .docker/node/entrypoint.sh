#!/bin/bash
set -e

npm install
npm run migration:run
npm run seed:run
exec npm run dev
