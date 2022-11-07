const fs = require('fs');
const path = require('path');
const {stdin, stdout, exit} = process;

const output = fs.createWriteStream(path.join(__dirname,'text.txt'));
stdout.write('Пожалуйста, введите любой текст\n');
stdin.on('data', chunk => {
    if(chunk.toString().trim() === 'exit') {
        console.log('Bye!');
        process.exit();
    };
    process.on('SIGINT', () => {
        console.log('Bye!');
        process.exit();
    })
    output.write(chunk);
        
});

