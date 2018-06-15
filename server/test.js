const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fs = require('fs-extra');

const url = 'mongodb://localhost:27017';

const dbName = 'xwords-grommet';


const transformDB = (file, data) => {
  const puzzle = JSON.parse(data);
  const date = file.split('.')[0];
  return { date, puzzle };
};

const loadFile = (transform) => async (file) => {
  let data = await fs.readFile('data/' + file, 'utf-8');
  return (transform !== undefined) ? transform(file, data) : data;
};


const f = async () => {

const client = await MongoClient.connect(url);
const db = await client.db(dbName);

const files = await fs.readdir('data')
const jsons = await Promise.all(files.map(loadFile(transformDB)));

const collection = db.collection('puzzles');

collection.insertMany(jsons, (err, results) => {
	console.log('err:', err);
	console.log('results:', results);

});

}

f();


