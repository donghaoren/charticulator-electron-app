Charticulator Desktop Application
====

Code to build a desktop application from Charticulator source code.

To set this up, first install the following to prepare a development environment:

- Install nodejs 8.0+: https://nodejs.org/
- Install yarnjs 1.7+: https://yarnpkg.com/

Initialize and download submodules:

    git submodule init
    git submodule update

Then, install the dependencies with:

    yarn

Run the following command to build the app:

    yarn build

Start the app locally:

    yarn start

Package the app:

    # Package for current platform
    yarn run dist

    # Package for a given platform
    yarn run dist:mac
    yarn run dist:win
    yarn run dist:linux

License
----

MIT