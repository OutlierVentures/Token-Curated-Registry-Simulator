const express = require('express');
const database = require('./database');
const bodyParser = require('body-parser');
const jsonfile = require('jsonfile');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;
const stdin = process.openStdin();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());

const tcrMap = new Map();

stdin.addListener('data', (d) => {
  console.log(`you entered: ${d.toString()}`);
});

function TcrObject(id, address, name, status, parameters) {
  this.id = id;
  this.address = address;
  this.name = name;
  this.status = status;
  this.contracts = {
    registry: {
      address: '',
      abi: '',
    },
    voting: {
      address: '',
      abi: '',
    },
  };
  this.parameters = parameters;
}

/* Get all TCRs */
app.get('/tcrs/', (req, res) => {
  res.json(JSON.stringify([...tcrMap]));
});

/* Create a new TCR */
app.post('/tcrs/', (req, res) => {
  const id = (Math.round((new Date()).getTime() / 1000)).toString();
  const paramTCR = new TcrObject(
    id, '0x234981210434', req.body.name, 'not deployed',
    req.body.parameters,
  );
  // Create a new config file for the tcr and write parameters inside
  const configFilename = `config${paramTCR.id}.json`;
  jsonfile.writeFile(`./conf/${configFilename}`, paramTCR.parameters, (err) => {
    if (err) console.error(err);
  });
  tcrMap.set(id, paramTCR);
  // Create a new TCR collection in the database
  database.createRegistry(paramTCR.name, () => {
    res.json(id);
  });
});

/* Get a specific TCR */
app.get('/tcrs/:tcrId', (req, res) => {
  res.json(tcrMap.get(req.params.tcrId));
});

app.delete('/tcrs/:tcrId', (req, res) => {
  const configName = `config${req.params.tcrId}.json`;
  console.log(configName);
  fs.unlink(`./conf/${configName}`, (err) => {
    if (err) console.error(err);
  });
  const tcrObj = tcrMap.get(req.params.tcrId);
  // tcrMap.delete(req.params.tcrId);
  // update database
  database.deleteTCR(tcrObj.name, () => {
    res.json(req.params.tcrId);
  });
});

app.get('/contracts/:contract.json', (req, res) => {
  const contractsDir = path.join(__dirname, '../build/contracts');
  const contract = JSON.parse(fs.readFileSync(`${contractsDir}/${req.params.contract}.json`));
  const network = contract.networks['5777'] || { address: null };
  res.json({
    address: network.address,
    abi: contract.abi,
  });
});

/* Add songs to a TCR */
app.post('/tcrs/:tcrId/listings', (req, res) => {
  const tcrObj = tcrMap.get(req.params.tcrId);
  database.addListing(tcrObj.name, req.body.songs, () => {
    res.json(tcrObj.id);
  });
});

/* Get all songs associated with the given TCR */
app.get('/tcrs/:tcrId/listings', (req, res) => {
  const tcrObj = tcrMap.get(req.params.tcrId);
  database.getListings(tcrObj.name).then((result) => {
    res.json(result);
  });
});

/* Update fields of a song */
app.put('/tcrs/:tcrId/listings', (req, res) => {
  const tcrObj = tcrMap.get(req.params.tcrId);
  database.updateSong(tcrObj.name, req.body.song.id, req.body.song, () => {
    res.json(tcrObj.id);
  });
});

app.listen(port, () => console.log(`TCR Server app listening on port ${port}!`));
