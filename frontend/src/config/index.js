// const Web3 = require('web3');

const contractsURL = 'http://localhost:3000/contracts';
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const { web3 } = window;

export const getContractInfo = async (contract) => {
  const data = await window.fetch(`${contractsURL}/${contract}.json`);
  return data.json();
};

export const getDefaultAccount = () => web3.eth.accounts[0];

export const getRegistryFactory = async () => {
  const registryFactoryArtifact = await getContractInfo('RegistryFactory');
  const { abi, address } = registryFactoryArtifact;
  return web3.eth.contract(abi).at(address);
};

export const getToken = async () => {
  const tokenArtifact = await getContractInfo('TestToken');
  const { abi, address } = tokenArtifact;
  return web3.eth.contract(abi).at(address);
};

export const getVotingContractAt = async (address) => {
  const votingContractArtifact = await getContractInfo('PLCRVoting');
  const { abi } = votingContractArtifact;
  return web3.eth.contract(abi).at(address);
};
