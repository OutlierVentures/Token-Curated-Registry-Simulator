import { AgentType, createAgentGroup } from './agents';
import TcrConnection from './TcrConnection';

const Ganache = require('ganache-core');

const basePort = 7000;
const highestPort = 8000;
let currentPort = basePort;

const defaultBalance = {
  [AgentType.MAINTAINER]: 500,
  [AgentType.CONTRIBUTOR]: 300,
  [AgentType.USER]: 200,
};

function getPort() {
  if (currentPort < highestPort) {
    currentPort++;
    return currentPort;
  }
  return null;
}

function restoreCurrentPort() {
  currentPort = basePort;
}

function getContractAbi() {}

function getMechanismsParam() {}

function deploySmartContract() {}

export default class Simulation {
  constructor() {
    this.agentGroups = [];
  }

  init() {
    const port = getPort();
    const serverObj = {
      accounts: this.createAccounts(),
      port,
    };
    this.server = Ganache.server(serverObj);
    this.server.listen(port, (err) => {
      if (err) {
        throw new Error(err.toString());
      }
    });
    const smartContracrAddr = deploySmartContract(port, getMechanismsParam());
    this.tcrConnection = new TcrConnection(port, smartContracrAddr, getContractAbi());
  }

  run() {
    if (!this.server || !this.tcrConnection) {
      throw new Error('.init() must be called before .run() can be called');
    }

    // Do stuff here
  }

  stop() {
    if (this.server) {
      this.server.close();
      restoreCurrentPort();
    }
  }

  addAgentGroup(agentType, behaviors, population) {
    const newGroup = createAgentGroup(agentType, behaviors, population);
    this.agentGroups.push(newGroup);
  }

  createAccounts() {
    return [].concat(
      this.agentGroups.map((agentGroup) => {
        const balance = defaultBalance[agentGroup.type];
        return agentGroup.agents.map(agent => ({
          balance,
          secretKey: agent.secretKey,
        }));
      }),
    );
  }

  /**
   * Get the balance of an agent.
   * @param  {string} address - Address of the agent to get the balance of, with the format '0x...'
   * @return {number} Balance of the agent in wei.
   */
  getAgentBalance(address) {
    if (!this.server || !this.tcrConnection) {
      throw new Error('.init() must be called before .getAgentBalance() can be called');
    }

    return this.tcrConnection.getBalance(address);
  }
}
