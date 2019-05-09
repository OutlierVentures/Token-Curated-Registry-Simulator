# Token Curated Registry Simulator

This is the work of Ece Kayan, Emma Claxton, Hailey Fong, Matthew Cheung, Noel Lee and Yoon Kim as part of the Outlier Ventures Imperial Research Project.

This repo compiles the aforementioned individuals's work from [the original repos](https://github.com/TCR-Simulator) with a few minor tweaks.

## Install

Requires: Linux or MacOS.

Note: this will install Node 8 and (for Linux only) npm 4.

```
./install.sh
```

If you have an `npm git` failure, set `git config --global url."https://github.com".insteadOf git://github.com`.

## Run

`npm start` in each of the backend and frontend folders.

In order to use the dApp, you will need tokens to do so. You can do this by deploying `contracts/contracts/TestToken.sol` to whatever network you choose to use, and sending your metamask address the tokens. Deployment automation can be found in the `contracts folder`: `npm run compile` then `npm run deploy-proxies:[network]`.

More specific instructions can be found in the readmes in each folder.

