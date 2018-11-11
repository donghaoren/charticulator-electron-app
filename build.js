const fs = require("fs-extra");
const multirun = require("multirun");

let sequence = [];

// The default dev sequence
const devSequence = [
  "cleanup",
  "copy",
  "charticulator_extensions",
  "charticulator",
  "copy_charticulator",
  "post_process"
];

async function rewriteVersion() {
  const pkgCharticulator = JSON.parse(
    await fs.readFile("charticulator/package.json", "utf-8")
  );
  const pkg = JSON.parse(await fs.readFile("app/package.json", "utf-8"));
  pkg.version = pkgCharticulator.version;
  await fs.writeFile("app/package.json", JSON.stringify(pkg, null, 2), "utf-8");
}

let COMMANDS = {
  // Remove the entire build directory
  cleanup: () => fs.remove("app"),
  copy: [
    () => fs.copy("src", "app"),
    () => fs.copy("resources/fonts.css", "app/fonts.css"),
    () => fs.copy("config.yml", "charticulator/config.yml")
  ],
  charticulator: ["cd charticulator && yarn run build"],
  charticulator_extensions: [
    "cd charticulator-extensions/powerbi-visual-builder && yarn run build",
    () =>
      fs.copy(
        "charticulator-extensions/powerbi-visual-builder/dist/powerbi_visual_builder.js",
        "charticulator/extensions/powerbi_visual_builder.js"
      ),
    () =>
      fs.copy(
        "charticulator-extensions/powerbi-visual-builder/dist/powerbi_visual_builder.js",
        "app/extensions/powerbi_visual_builder.js"
      )
  ],
  copy_charticulator: [
    "scripts/about.bundle.js",
    "scripts/app.bundle.js",
    "scripts/container.bundle.js",
    "scripts/worker.bundle.js",
    "data/THIRD_PARTY.json",
    "data/config.js",
    "styles/app.css",
    "styles/page.css"
  ].map(name => () => fs.copy("charticulator/dist/" + name, "app/" + name)),
  post_process: () => rewriteVersion()
};

/** Run the specified commands names in sequence */
async function runCommands(sequence) {
  for (const cmd of sequence) {
    console.log("Build: " + cmd);
    await multirun.run(COMMANDS[cmd]);
  }
}

// Execute the specified commands, with no args, run the default sequence
if (sequence.length == 0) {
  sequence = devSequence;
}
runCommands(sequence).catch(e => {
  console.log(e.message);
  process.exit(-1);
});
