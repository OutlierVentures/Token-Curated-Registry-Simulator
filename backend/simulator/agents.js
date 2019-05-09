import {
  sleep,
  randomInRange,
  randomIntInRange,
  privateToAddressHex,
  generateSecretKey,
} from './utils';
import { SubmitAction, VoteAction } from './actions';

export const AgentType = {
  MAINTAINER: 'maintainer',
  CONTRIBUTOR: 'contributor',
  USER: 'user',
};

class Agent {
  constructor(secretKey) {
    this.secretKey = secretKey || generateSecretKey();
    this.address = privateToAddressHex(this.secretKey);
  }
}

class AgentGroup {
  constructor(behaviors, population) {
    this._behaviors = {};
    this.behaviors = behaviors;
    this.agents = Array(population).fill().map(() => new Agent());
  }

  get [Symbol.toStringTag]() { // eslint-disable-line class-methods-use-this
    return 'AgentGroup';
  }

  get ALLOWED_BEHAVIORS() { // eslint-disable-line class-methods-use-this
    return [];
  }

  get population() {
    return this.agents.length;
  }

  get behaviors() {
    return this._behaviors;
  }

  set behaviors(newBehaviors) {
    const invalidBehaviors = Object.keys(newBehaviors).filter(b => !this.isBehaviorAllowed(b));
    if (invalidBehaviors.length > 0) {
      throw new Error((
        `Behavior(s) ${invalidBehaviors.join(', ')} are not allowed.`
        + `The only allowed behaviors of ${typeof this} are: ${this.ALLOWED_BEHAVIORS.join(', ')}`
      ));
    }
    this._behaviors = newBehaviors;
  }

  isBehaviorAllowed(behavior) {
    return this.ALLOWED_BEHAVIORS.includes(behavior);
  }

  generateAction() { // eslint-disable-line class-methods-use-this
    return null;
  }

  async startGeneratingActions(tcrConnection) {
    while (true) { // eslint-disable-line no-constant-condition
      const time = randomInRange(2000, 5000); // TODO: change this based on action frequency
      await sleep(time); // eslint-disable-line no-await-in-loop

      // Pick a random agent
      const agentIndex = randomIntInRange(0, this.population);
      const { address: agentAddress } = this.agents[agentIndex];

      // Generate random action
      const action = this.generateAction(tcrConnection, agentAddress);
      if (action) {
        action.execute();
      }
    }
  }
}

export class MaintainerGroup extends AgentGroup {
  get [Symbol.toStringTag]() { // eslint-disable-line class-methods-use-this
    return 'MaintainerGroup';
  }

  get ALLOWED_BEHAVIORS() { // eslint-disable-line class-methods-use-this
    return ['frequency', 'acceptanceLikelihood'];
  }

  generateAction(tcrConnection, initiator) { // eslint-disable-line class-methods-use-this
    const submission = null; // TODO: pick a pending submission
    const accept = true; // TODO: change this based on agent behavior
    return new VoteAction(tcrConnection, initiator, submission, accept);
  }
}

export class ContributorGroup extends AgentGroup {
  get [Symbol.toStringTag]() { // eslint-disable-line class-methods-use-this
    return 'ContributorGroup';
  }

  get ALLOWED_BEHAVIORS() { // eslint-disable-line class-methods-use-this
    return ['submissionQuality', 'frequency'];
  }

  generateAction(tcrConnection, initiator) { // eslint-disable-line class-methods-use-this
    const submissionQuality = 0.5; // TODO: change this based on agent behavior
    return new SubmitAction(tcrConnection, initiator, submissionQuality);
  }
}

export class UserGroup extends AgentGroup {
  get [Symbol.toStringTag]() { // eslint-disable-line class-methods-use-this
    return 'UserGroup';
  }
}

export function createAgentGroup(type, behaviors, population) {
  switch (type) {
    case AgentType.MAINTAINER:
      return new MaintainerGroup(behaviors, population);
    case AgentType.CONTRIBUTOR:
      return new ContributorGroup(behaviors, population);
    case AgentType.USER:
      return new UserGroup(behaviors, population);
    default:
      throw new TypeError(`Unrecognized agent type ${type}`);
  }
}
