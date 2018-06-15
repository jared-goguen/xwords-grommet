const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'xwords-grommet';

let clientInstance = null;
let dbInstance = null;
let collections = {};

export const getClient = async () => {
  if (assert.equal(clientInstance, null)) {
    clientInstance = await MongoClient.connect(url)
    return clientInstance;
  } else {
    return clientInstance;  
  }
}

export const getDatabase = async () => {
  if (assert.equal(dbInstance, null)) {
    const client = await getClient();
    dbInstance = await client.db(dbName);
    return dbInstance;
  } else {
    return dbInstance;  
  }
}

export const getCollection = async (name) => {
  const db = await getDatabase();
  let collection = collections[name];

  if (collection === undefined) {
    collection = collections[name] = await db.collection(name);
    return collection;
  } else {
    return collection;  
  }  
}


