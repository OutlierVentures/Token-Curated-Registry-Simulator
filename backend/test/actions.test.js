import sinon from 'sinon';

import { SubmitAction, VoteAction } from '../simulator/actions';
import TcrConnection from '../simulator/TcrConnection';

describe('SubmitAction', () => {
  const tcrConnection = new TcrConnection();
  const mock = sinon.mock(tcrConnection);

  it('submits through TcrConnection', () => {
    const submitAction = new SubmitAction(tcrConnection, '0x123', 0.4);
    mock.expects('submit').once();
    submitAction.execute();
    mock.verify();
  });
});

describe('VoteAction', () => {
  const tcrConnection = new TcrConnection();
  const mock = sinon.mock(tcrConnection);

  it('votes through TcrConnection', () => {
    const voteAction = new VoteAction(tcrConnection, '0x123', '123', true);
    mock.expects('vote').once();
    voteAction.execute();
    mock.verify();
  });
});
