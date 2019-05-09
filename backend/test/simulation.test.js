import { expect } from 'chai';

import Simulation from '../simulator/Simulation';
import { AgentType } from '../simulator/agents';

describe('Simulation', () => {
  let simulation = null;

  beforeEach(() => {
    simulation = new Simulation();
  });

  it('cannot be run without calling .init() before', () => {
    const attempt = () => simulation.run();
    expect(attempt).to.throw(Error);
  });

  it('can run and return a result asynchronously', async () => {
    simulation.addAgentGroup(AgentType.MAINTAINER, { acceptanceLikelihood: 0.5 }, 10);
    simulation.addAgentGroup(AgentType.CONTRIBUTOR, { submissionQuality: 0.5 }, 20);

    simulation.init();
    simulation.run();
    simulation.stop();
  });

  it('has no agents on creation', () => {
    const { agentGroups } = simulation;
    expect(agentGroups).to.be.an('array').that.is.empty; // eslint-disable-line no-unused-expressions
  });

  it('can add agent groups', () => {
    simulation.addAgentGroup(AgentType.MAINTAINER, { acceptanceLikelihood: 0.5 }, 10);
    let { agentGroups } = simulation;
    expect(agentGroups).to.have.lengthOf(1);

    simulation.addAgentGroup(AgentType.CONTRIBUTOR, { submissionQuality: 0.5 }, 20);
    ({ agentGroups } = simulation);
    expect(agentGroups).to.have.lengthOf(2);

    simulation.addAgentGroup(AgentType.USER, {}, 30);
    ({ agentGroups } = simulation);
    expect(agentGroups).to.have.lengthOf(3);

    simulation.addAgentGroup(AgentType.CONTRIBUTOR, { submissionQuality: 0.1 }, 5);
    ({ agentGroups } = simulation);
    expect(agentGroups).to.have.lengthOf(4);
  });

  it('does not allow adding of unrecognized agent types', () => {
    const attempt = () => simulation.addAgentGroup('SecretAgent', {}, 10);
    expect(attempt).to.throw(TypeError);

    const { agentGroups } = simulation;
    expect(agentGroups).to.be.empty; // eslint-disable-line no-unused-expressions
  });

  describe('Agents in submission', () => {
    beforeEach(() => {
      simulation = new Simulation();
      simulation.addAgentGroup(AgentType.MAINTAINER, { acceptanceLikelihood: 0.5 }, 10);
      simulation.addAgentGroup(AgentType.CONTRIBUTOR, { submissionQuality: 0.5 }, 20);
      simulation.init();
    });

    it('can get the balance in an agent\'s account', async () => {
      const { address } = simulation.agentGroups[0].agents[0];
      const balance = await simulation.getAgentBalance(address);
      expect(balance).to.be.a('number');
      expect(balance).to.be.at.least(0);
    });

    afterEach(() => {
      simulation.stop();
    });
  });
});
