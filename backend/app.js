const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const AdmZip = require("adm-zip");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: "https://angular-initializer-aa079.web.app",
    methods: ["GET", "POST", "OPTIONS"],
  })
);
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  let { angularVersion, projectName, ssr, stylesheet } = req.body;
  angularVersion = "@angular/cli@" + angularVersion;
  stylesheet = "--style=" + stylesheet;

  const args = [
    angularVersion,
    "new",
    projectName,
    stylesheet,
    "--skip-git",
    "--skip-install",
  ];
  if (ssr === "true") {
    args.push("--ssr");
  }

  let myPromise = new Promise(function (resolve, reject) {
    const command = "npx";
    const child = spawn(command, args, {
      shell: true,
      cwd: "generated",
    });

    child.stdout.on("data", (data) => {
      console.log(`Output: ${data}`);
    });

    child.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
    });

    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Process exited with code ${code}`));
    });
  });

  myPromise
    .then(function () {
      const projectFolderPath = path.join("generated", projectName);
      const zip = new AdmZip();
      zip.addLocalFolder(projectFolderPath);
      const projectZipPath = path.join("generated", `${projectName}.zip`);
      zip.writeZip(projectZipPath);
    })
    .then(function () {
      const projectZipPath = path.join("generated", `${projectName}.zip`);
      fs.readFile(projectZipPath, (err, data) => {
        if (err) {
          return res.status(500).send("Error reading file");
        }
        const fileName = `${projectName}.zip`;
        res.setHeader("Content-Type", "application/zip");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${fileName}"`
        );
        res.send(data);
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error creating project");
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
