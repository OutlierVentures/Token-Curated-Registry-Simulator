import { getToken, getRegistryFactory } from '../config';

export const PARAM_KEYS = [
  { key: 'minDeposit', defaultVal: 10000000000000000000 },
  { key: 'pMinDeposit', defaultVal: 10000000000000000000 },
  { key: 'applyStageLength', defaultVal: 600 },
  { key: 'pApplyStageLength', defaultVal: 1200 },
  { key: 'commitStageLength', defaultVal: 600 },
  { key: 'pCommitStageLength', defaultVal: 1200 },
  { key: 'revealStageLength', defaultVal: 600 },
  { key: 'pRevealStageLength', defaultVal: 1200 },
  { key: 'dispensationPct', defaultVal: 50 },
  { key: 'pDispensationPct', defaultVal: 50 },
  { key: 'voteQuorum', defaultVal: 50 },
  { key: 'pVoteQuorum', defaultVal: 50 },
  { key: 'exitTimeDelay', defaultVal: 600 },
  { key: 'exitPeriodLen', defaultVal: 600 },
];

export const EXPOSED_PARAMS = [
  'minDeposit',
  'applyStageLength',
  'commitStageLength',
  'revealStageLength',
  'dispensationPct',
  'voteQuorum',
  'exitTimeDelay',
  'exitPeriodLen',
];

export async function getAllTcrs() {
  const registryFactory = await getRegistryFactory();
  return new Promise((resolve, reject) => {
    registryFactory.NewRegistry({}, { fromBlock: 0, toBlock: 'latest' }).get((error, events) => {
      if (error) {
        console.error(error); // eslint-disable-line no-console
        reject(error);
      } else {
        const tcrs = events.map(({ args }) => ({
          name: args.name,
          address: args.registry,
          votingAddress: args.plcr,
          parameters: args.parameters
            .map((val, i) => ({ key: PARAM_KEYS[i].key, value: val.c[0] }))
            .filter(({ key }) => EXPOSED_PARAMS.includes(key)),
        }));
        resolve(tcrs);
      }
    });
  });
}

export async function deploy(name, parameters) {
  const token = await getToken();
  const registryFactory = await getRegistryFactory();

  const params = PARAM_KEYS.map(({ key, defaultVal }) => (
    { key, value: parameters[key] || defaultVal }
  ));

  return new Promise((resolve, reject) => {
    registryFactory.newRegistryBYOToken(
      token.address,
      params.map(({ value }) => value),
      name,
      (error, transaction) => {
        if (error) {
          console.error(error); // eslint-disable-line no-console
          reject(error);
        } else {
          const event = registryFactory.NewRegistry({}, { fromBlock: 0, toBlock: 'latest' });
          event.watch((err, res) => {
            if (err) {
              console.error(err); // eslint-disable-line no-console
              reject(err);
            } else if (res.transactionHash === transaction) {
              event.stopWatching();
              resolve({
                name: res.args.name,
                address: res.args.registry,
                votingAddress: res.args.plcr,
                parameters: params.filter(({ key }) => EXPOSED_PARAMS.includes(key)),
              });
            }
          });
        }
      },
    );
  });
}
