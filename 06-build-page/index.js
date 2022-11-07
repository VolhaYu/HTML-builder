const fs = require('fs');
const path = require('path');
const fsPromise = require('fs/promises');

const { stdin } = require('process');

async function creatFolder() {

    try {
        await fs.promises.access(path.join(__dirname,'project-dist'));
        await fsPromise.rm(path.join(__dirname,'project-dist'), {recursive: true}, err => {
            if(err) console.log(err);
            console.log("удалили");
        });
        await fsPromise.mkdir(path.join(__dirname,'project-dist'), {recursive: true}, err => {
            if(err) console.log(err);
            console.log('new folder');
        });
    } catch (error) {
        await fsPromise.mkdir(path.join(__dirname,'project-dist'), {recursive: true}, err => {
            if(err) console.log(err);
            console.log('new folder');
        });
    }
    creatIndex();
    creatStyle();
    copyAssets();
}
creatFolder();

async function creatIndex() {
    const distFolder = path.join(__dirname, 'project-dist');
    const input = fs.createReadStream(path.join(__dirname,'template.html'));
    const output = fs.createWriteStream(path.join(distFolder,'index.html'));
    let str = '';
    input.on('data', data => {
        str = data.toString();
        
        const arr = [];
        let regexp = '';
        fs.readdir('06-build-page/components', {withFileTypes: true}, (err, files) => {
            if(!err) {
                for(let i = 0; i < files.length; i++) {
                    const name = path.basename(path.join(__dirname,'components', files[i].name.split('.')[0]));
                        regexp = `{{${name}}}`;
                        arr.push(regexp);
                        fs.readFile(path.join(__dirname,'components', files[i].name), 'utf-8', (err, fileContent) => {
                            str = str.replace(arr[i], fileContent);
                            fs.writeFile(path.join(distFolder,'index.html'), str, (err) => {
                                if(err) console.log(err);
                            });
                            return str;
                        });
                    }
            }
        });
    });
}

async function creatStyle() {    
    const output = fs.createWriteStream(path.join(__dirname, 'project-dist/style.css'));
    const newFile =[];
    fs.readdir('06-build-page/styles', {withFileTypes: true}, async(err, files) => {
        if(!err) {
            files.forEach(async(file) => {
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
}

async function copyAssets(assetsFolder, newAssetsFolder) {
    assetsFolder = '06-build-page/assets';
    newAssetsFolder = '06-build-page/project-dist/assets';

    await fsPromise.mkdir(path.join(newAssetsFolder), {recursive: true}, err => {
        if(err) console.log(err);
    });

    fs.readdir(assetsFolder, {withFileTypes: true}, (err, dirents) => {       
        if(!err) {
            dirents.forEach((dirent) => {
                const assetsFile = path.join(assetsFolder, dirent.name);
                const newAssetsFile = path.join(newAssetsFolder, dirent.name);
                if(dirent.isFile()) {
                    fs.readFile(path.join(assetsFile), 'utf-8', (err, fileContent) => {
                        if (err) console.log(err);
                        fs.copyFile(assetsFile, newAssetsFile, (err) => {
                                        if(err) console.log(err);
                                    });
                        
                    });                    
                }else {
                    fs.mkdir(path.join(newAssetsFolder, dirent.name), {recursive: true}, err => {
                        if(err) console.log(err);
                    });
                    fs.readdir(`06-build-page/assets/${dirent.name}`, {withFileTypes: true}, (err, files) => {
                        files.forEach((file) => {
                            const nestedFile = path.join(`06-build-page/assets/${dirent.name}`, file.name);
                            const newNestedFile = path.join(`06-build-page/project-dist/assets/${dirent.name}`, file.name);                           
                            fs.readFile(path.join(`06-build-page/assets/${dirent.name}`, file.name), 'utf-8', (err, fileContent) => {
                                if (err) console.log(err);
                                fs.copyFile(nestedFile, newNestedFile, (err) => {
                                                if(err) console.log(err);
                                            });
                                
                            });

                        })
                    });
                }               
            });
        }
    });  
} 

