import fetch from 'node-fetch';
import fs from 'fs-extra';
import xml2js from 'xml2js';
import { getCollection } from './client';

const parseXMLString = (xml) => new Promise((resolve, reject) => {
  xml2js.parseString(xml, (err, result) => {
    if (err) {
      reject(err)
    } else {
      resolve(result)
    }
  });
});

const root = 'server/data';

const qualifyPath = path => `${root}/${path}`;

const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
const qualifyDate = (date) => {
  let day = date.getDate();
  day = day < 10 ? `0${day}` : day;
  return `${months[date.getMonth()]}${day}-${date.getFullYear()}`;
};

const unqualifyDate = (qDate) => {
  const [, month, day, year] = qDate.match(/([A-Za-z]{3})([0-9]{2})-([0-9]{4})/);
  return new Date(year, months.indexOf(month), day);
};

const savePuzzle = async (path) => {
  const url = `https://www.xwordinfo.com/xml/Puzzles/2018/${path}.xml`;
  const response = await fetch(url);
  const xml = await response.text();
  const json = await parseXMLString(xml);
  const puzzle = json.Puzzles.Puzzle[0]
  const collection = await getCollection('puzzles');
  collection.insert(transformDB(path, puzzle))
  fs.writeFile(qualifyPath(`${path}.json`), JSON.stringify(puzzle));
};

const _updatePuzzles = async (date) => {
  const qDate = qualifyDate(date);
  const qPath = qualifyPath(qDate);

  try {
    await fs.stat(`${qPath}.json`);
  } catch (err) {
    await savePuzzle(qDate);
    date.setDate(date.getDate() - 1);
    _updatePuzzles(date);
  }
};

export const updatePuzzles = () => {
  _updatePuzzles(new Date());
};

const loadFile = (transform) => async (file) => {
  let data = await fs.readFile(qualifyPath(file), 'utf-8');
  return (transform !== undefined) ? transform(file, data) : data;
};

const transformDB = (path, data) => {
  const puzzle = JSON.parse(data);
  return { path, puzzle };
};

const displayEntry = (entry) => {
  return {
    title: entry.puzzle.Title[0],
    date: entry.puzzle.Date[0], 
    path: entry.path
  };
};

const entryCompare = ({ pathA, puzzleA }, { pathB, puzzleB }) => {
  const dateA = unqualifyDate(pathA);
  const dateB = unqualifyDate(pathB);
  return dateB - dateA;
};

export const mostRecentPuzzles = async (count) => {
  const collection = await getCollection('puzzles');
  const entries = await collection.find({}).toArray();
  entries.sort(entryCompare);
  const recent = entries.slice(0, count);
  return recent.map(displayEntry);
};

const populatePuzzleDatabase = async () => {
  const collection = await getCollection('puzzles');
  const files = await fs.readdir('data')
  const jsons = await Promise.all(files.map(loadFile(transformDB)));

  collection.insertMany(jsons, (err, results) => {
    console.log('err:', err);
    console.log('results:', results);
  });
};

export const getPuzzle = async (path) => {
  const collection = await getCollection('puzzles');
  return collection.find({path});
};

const f = async () => {
  let p = await getPuzzle('Apr01-2018');
  console.log(p);  
}

f();

