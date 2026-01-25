const fs = require('fs');
const content = fs.readFileSync('.env', 'utf8');
const lines = content.split(/\r?\n/);
lines.forEach((line, i) => {
    if (line.trim()) {
        const masked = line.length > 30 ? line.substring(0, 30) + '...' : line;
        console.log(`Line ${i + 1}: ${masked}`);
    }
});
