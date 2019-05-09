import { expect } from 'chai';

import { AgentType, createAgentGroup } from '../simulator/agents';

describe('Agent group creation', () => {
  it('creates the correct type of agents', () => {
    const maintainers = createAgentGroup(AgentType.MAINTAINER, {}, 1);
    const contributors = createAgentGroup(AgentType.CONTRIBUTOR, {}, 1);
    const users = createAgentGroup(AgentType.USER, {}, 1);

    expect(maintainers).to.be.a('MaintainerGroup');
    expect(contributors).to.be.a('ContributorGroup');
    expect(users).to.be.a('UserGroup');
  });

  it('does not allow unrecognized agent types', () => {
    const attempt = agentType => () => createAgentGroup(agentType, {}, 5);
    expect(attempt('Agent007')).to.throw(TypeError);
  });

  it('initializes with a specified population of agents', () => {
    const agentGroup = createAgentGroup(AgentType.MAINTAINER, {}, 5);
    const { agents } = agentGroup;

    expect(agentGroup.population).to.equal(5);
    expect(agents.length).to.equal(5);
  });

  describe('MaintainerGroup', () => {
    let maintainers = null;

    beforeEach(() => {
      maintainers = createAgentGroup(AgentType.MAINTAINER, {}, 1);
    });

    it('only allows these behaviors: frequency, acceptanceLikelihood', () => {
      const validBehaviors = {
        frequency: 10,
        acceptanceLikelihood: 0.8,
      };
      const invalidBehaviors = {
        ...validBehaviors,
        badBehavior1: 123,
        badBehavior2: 999,
      };

      const attempt = behaviors => () => createAgentGroup(AgentType.MAINTAINER, behaviors, 1);
      expect(attempt(validBehaviors)).to.not.throw();
      expect(attempt(invalidBehaviors)).to.throw(Error, /badBehavior1/);
      expect(attempt(invalidBehaviors)).to.throw(Error, /badBehavior2/);
    });

    it('generates SubmitAction\'s', () => {
      const action = maintainers.generateAction();
      expect(action).to.be.a('VoteAction');
    });
  });

  describe('ContributorGroup', () => {
    let contributors = null;

    beforeEach(() => {
      contributors = createAgentGroup(AgentType.CONTRIBUTOR, {}, 1);
    });

    it('only allows these behaviors: frequency, submissionQuality', () => {
      const validBehaviors = {
        frequency: 10,
        submissionQuality: 0.5,
      };
      const invalidBehaviors = {
        ...validBehaviors,
        badBehavior1: 123,
        badBehavior2: 999,
      };

      const attempt = behaviors => () => createAgentGroup(AgentType.CONTRIBUTOR, behaviors, 1);
      expect(attempt(validBehaviors)).to.not.throw();
      expect(attempt(invalidBehaviors)).to.throw(Error, /badBehavior1/);
      expect(attempt(invalidBehaviors)).to.throw(Error, /badBehavior2/);
    });

    it('generates SubmitAction\'s', () => {
      const action = contributors.generateAction();
      expect(action).to.be.a('SubmitAction');
    });
  });

  describe('UserGroup', () => {
    let users = null;

    beforeEach(() => {
      users = createAgentGroup(AgentType.USER, {}, 1);
    });

    it('does not allow any behaviors', () => {
      const validBehaviors = {};
      const invalidBehaviors = {
        ...validBehaviors,
        badBehavior1: 123,
        badBehavior2: 999,
      };

      const attempt = behaviors => () => createAgentGroup(AgentType.USER, behaviors, 1);
      expect(attempt(validBehaviors)).to.not.throw();
      expect(attempt(invalidBehaviors)).to.throw(Error, /badBehavior1/);
      expect(attempt(invalidBehaviors)).to.throw(Error, /badBehavior2/);
    });

    it('does not generate any kind of actions', () => {
      const action = users.generateAction();
      expect(action).to.be.null; // eslint-disable-line no-unused-expressions
    });
  });
});
