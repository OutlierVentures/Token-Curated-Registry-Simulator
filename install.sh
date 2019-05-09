#!/bin/bash

onred='\033[41m'
ongreen='\033[42m'
onyellow='\033[43m'
endcolor="\033[0m"

# Handle errors
set -e
error_report() {
    echo -e "${onred}Error: install.sh failed on line $1.$endcolor"
}
trap 'error_report $LINENO' ERR

echo -e "${onyellow}Installing the TCR Simulator...$endcolor"
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    apt-get update
    apt-get install -y build-essential curl git
    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    sudo apt-get install -y nodejs
    npm install -g npm@4
elif [[ "$OSTYPE" == "darwin"* ]]; then
    xcode-select --version || xcode-select --install
    brew --version || yes | /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    brew install node@8
fi
cd contracts
npm install
cd ../backend
npm install
cd ../frontend
npm install

echo -e "${ongreen}TCR Simulator installed.$endcolor"
