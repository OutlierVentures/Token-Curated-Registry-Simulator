const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://softeng18:${process.env.SOFTENG_MONGODB_PASSWORD}@musicmap-caf2e.mongodb.net/test?retryWrites=true`;
const dbName = 'musicmap';
const options = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['id'],
      properties: {
        id: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        title: {
          bsonType: 'string',
          description: 'must be a string',
        },
        status: {
          bsonType: 'string',
        },
        url: {
          bsonType: 'string',
          description: 'must be a string',
        },
        listingHash: {
          bsonType: 'string',
          description: 'must be a string',
        },
        challengeHash: {
          bsonType: 'string',
          description: 'must be a string',
        },
      },
    },
  },
};

function createCollection(client, name, callback) {
  client.db(dbName).createCollection(name, options).then((res) => {
    callback(res);
  });
}

function insertListing(client, colName, listings, callback) {
  client.db(dbName).collection(colName).insertMany(listings).then((res) => {
    callback(res);
  });
}

function returnAll(client, colName, callback) {
  client.db(dbName).collection(colName).find({}).toArray((err, docs) => {
    callback(docs);
  });
}

function updateCollection(client, colName, songId, params, callback) {
  client.db(dbName).collection(colName).updateOne({ id: songId }, { $set: params })
    .then(() => {
      callback();
    });
}

module.exports = {
  createRegistry(name, callback) {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
      createCollection(client, name, () => {
        client.close(callback);
      });
    });
  },
  addListing(name, list, callback) {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
      insertListing(client, name, list, () => {
        client.close(callback);
      });
    });
  },
  async getListings(name) {
    return new Promise(((resolve) => {
      MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        returnAll(client, name, (res) => {
          client.close();
          resolve(res);
        });
      });
    }));
  },
  updateSong(colName, id, params, callback) {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
      updateCollection(client, colName, id, params, () => {
        client.close(callback);
      });
    });
  },
  deleteTCR(colName, callback) {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
      client.db(dbName).collection(colName).drop().then(() => {
        client.close(callback);
      });
    });
  },
};
