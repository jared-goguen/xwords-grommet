const MongoClient = require('mongodb').MongoClient;

let url;

if (process.env.NODE_EVNV === 'production') {
  url = 'mongodb://admin:password1@ds163680.mlab.com:63680/heroku_wk9qqvxf';
} else {
  url = 'mongodb://localhost:27017';
}

const dbName = 'xwords-grommet';

let clientInstance = null;
let dbInstance = null;
let collections = {};

export const getClient = async () => {
  if (clientInstance === null) {
    clientInstance = await MongoClient.connect(url)
  }
  return clientInstance;  
}

export const getDatabase = async () => {
  if (dbInstance === null) {
    const client = await getClient();
    dbInstance = client.db(dbName);
  }
  return dbInstance;  
}

export const getCollection = async (name) => {
  const db = await getDatabase();
  let collection = collections[name];
  if (collection === undefined) {
    collection = collections[name] = db.collection(name);
  }
  return collection; 
}


