const fs = require("fs-extra");

async function createRelease() {
  // Get build number from travis
  let buildNumber = "0";
  if (process.env["TRAVIS_BUILD_NUMBER"]) {
    buildNumber = process.env["TRAVIS_BUILD_NUMBER"];
  }
  // Remove existing
  await fs.remove("release");
  // Get version
  const package = JSON.parse(
    await fs.readFile("charticulator/package.json", "utf-8")
  );
  const version = package.version;
  console.log("Charticulator version is: " + version);

  const common_prefix = `Charticulator-v${version}-build-${buildNumber}`;
  // Create the release directory
  await fs.mkdirp("release");

  const files = [
    [`Charticulator Setup ${version}.exe`, `${common_prefix}-Windows.exe`],
    [`Charticulator-${version}.dmg`, `${common_prefix}-macOS.dmg`],
    [
      `Charticulator-${version}-x86_64.AppImage`,
      `${common_prefix}-Linux-x86_64.AppImage`
    ],
    [`Charticulator_${version}_amd64.deb`, `${common_prefix}-Linux-x86_64.deb`],
    [`Charticulator-${version}.x86_64.rpm`, `${common_prefix}-Linux-x86_64.rpm`]
  ];
  for (const [input, output] of files) {
    if (await fs.exists("bundle/" + input)) {
      await fs.copy("bundle/" + input, "release/" + output);
    } else {
      console.log("Input not exist: " + input);
    }
  }
}

if (process.argv.indexOf("--name") >= 0) {
  let buildNumber = "0";
  if (process.env["TRAVIS_BUILD_NUMBER"]) {
    buildNumber = process.env["TRAVIS_BUILD_NUMBER"];
  }
  const package = JSON.parse(
    fs.readFileSync("charticulator/package.json", "utf-8")
  );
  const version = package.version;
  console.log(`v${version}-build-${buildNumber}`);
} else {
  createRelease();
}
