const fs = require('fs');
const path = require('path');
const {stdin, stdout, exit} = process;

fs.readdir('03-files-in-folder/secret-folder', {withFileTypes: true}, (err, files) => {
    if(!err) {
        files.forEach((file) => {
            if(file.isFile()) {
                const name = path.basename(path.join(__dirname,'secret-folder', file.name.split('.')[0]));
                const ext = path.extname(path.join(__dirname,'secret-folder', file.name));
                fs.stat(path.join(__dirname,'secret-folder', file.name), (err, stats) => {
                    const size = stats.size;
                    // console.log(size);
                    console.log(`${name} - ${ext} - ${size}B`);
                });
            }            
        });
    }
});


