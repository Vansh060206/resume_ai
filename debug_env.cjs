/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const content = fs.readFileSync('.env', 'utf8');
const lines = content.split('\n');
lines.forEach(line => {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=/);
    if (match) {
        console.log(match[1]);
    }
});
