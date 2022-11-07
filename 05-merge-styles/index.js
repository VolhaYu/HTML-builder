const fs = require('fs');
const path = require('path');
const { stdin } = require('process');
fs.unlink('project-dist/bundle.css', err => {
    if(err) console.log(err);
 });

const output = fs.createWriteStream(path.join(__dirname, 'project-dist/bundle.css'));
const newFile =[];
fs.readdir('05-merge-styles/styles', {withFileTypes: true}, (err, files) => {
    if(!err) {
        files.forEach((file) => {
            fs.readFile(path.join(__dirname, 'styles',file.name), 'utf-8', (err, fileContent) => {
                if (err) console.log(err);
                const ext = path.extname(path.join(__dirname,'styles', file.name));
                if(file.isFile()) {
                    if(ext === '.css') {
                        newFile.push(fileContent);
                        output.write(newFile.join('').toString());
                    }
                }                
            });
        });
    }
});
