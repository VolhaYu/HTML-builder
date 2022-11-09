const fs = require("fs");
const path = require("path");
const fsPromise = require("fs/promises");

async function copyDir() {
  try {
    await fs.promises.access(path.join(__dirname, "files-copy"));
    await fsPromise.rm(
      "04-copy-directory/files-copy",
      { recursive: true },
      (err) => {
        if (err) console.log(err);
      }
    );
    await fsPromise.mkdir(
      path.join(__dirname, "files-copy"),
      { recursive: true },
      (err) => {
        if (err) throw err;
      }
    );
  } catch (error) {
    await fsPromise.mkdir(
      path.join(__dirname, "files-copy"),
      { recursive: true },
      (err) => {
        if (err) throw err;
      }
    );
  }

  fs.readdir(
    "04-copy-directory/files",
    { withFileTypes: true },
    (err, files) => {
      if (!err) {
        files.forEach((file) => {
          fs.readFile(
            path.join(__dirname, "files", file.name),
            "utf-8",
            (err, fileContent) => {
              if (err) console.log(err);
              const filesFolder = path.join(__dirname, "files", file.name);
              fs.copyFile(
                filesFolder,
                path.join(__dirname, "files-copy", file.name),
                (err) => {
                  if (err) console.log(err);
                }
              );
            }
          );
        });
      }
    }
  );
}
copyDir();
