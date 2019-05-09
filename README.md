# Token Curated Registry Simulator

This is the work of Imperial College students as part of the Outlier Ventures Imperial Research Project.

This repo compiles the aforementioned individuals's work from [the original repos](https://github.com/TCR-Simulator) with a few minor tweaks.

## Install

Note: this will install Node 8.

```
./install.sh
```

## Run

`npm start` in each of the backend and frontend folders.

In order to use the dApp, you will need tokens to do so. You can do this by deploying `contracts/contracts/TestToken.sol` to whatever network you choose to use, and sending your metamask address the tokens. Deployment automation can be found in the `contracts folder`: `npm run compile` then `npm run deploy-proxies:[network]`.

More specific instructions can be found in the readmes in each folder.

