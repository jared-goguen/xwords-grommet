import MongoClient from 'mongodb'; 

let url, dbName;

if (process.env.NODE_ENV === 'production') {
  url = process.env.MONGODB_URI;
  dbName = process.env.MONGODB_URI.split('/').pop()
} else {
  url = 'mongodb://localhost:27017';
  dbName = 'xwords-grommet';
}

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


