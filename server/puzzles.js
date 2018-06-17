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

const root = 'server/json';

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
  fs.writeFile(qualifyPath(`${path}.json`), JSON.stringify(puzzle));
  const collection = await getCollection('puzzles');
  collection.insert(transformDB(path, puzzle));
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

const transformDB = (path, data) => {
  const raw = JSON.parse(data);
  const puzzle = {
    title: raw.Title[0],
    date: raw.Date[0],
    size: {
      rows: +(raw.Size[0].Rows), 
      columns: +(raw.Size[0].Cols)
    },
    grid: raw.Grid[0].Row,
    rebuses: raw.RebusEntries ? raw.RebusEntries[0].Rebus : undefined
  };

  puzzle.clues = [];
  for (let rawClue of raw.Clues[0].Clue) {
    let clue = {};
    clue.text = rawClue._;
    clue.row = +(rawClue.$.Row) - 1;
    clue.column = +(rawClue.$.Col) - 1;
    clue.direction = rawClue.$.Dir;
    clue.number = rawClue.$.Num;
    clue.answer = rawClue.$.Ans;
    puzzle.clues.push(clue);
  }

  puzzle.answers = puzzle.grid.map(row => row.split(''));

  puzzle.default = puzzle.answers.map(row => row.map(
    answer => (answer !== '.' ? '' : null)
  ));

  puzzle.adjacency = puzzle.answers.map(row => row.map(
    cell => (true ? cell !== '.' : false)
  ));

  puzzle.clueMarkers = [ ...Array(puzzle.size.rows) ].map(u => []);
  for (let clue of puzzle.clues) {
    let { row, column, number } = clue;
    puzzle.clueMarkers[row][column] = number;
  }

  return { path, puzzle };
};

const loadFile = (transform) => async (file) => {
  let data = await fs.readFile(qualifyPath(file), 'utf-8');
  let path = file.split('.')[0]
  return (transform !== undefined) ? transform(path, data) : data;
};

const populatePuzzleDatabase = async () => {
  const collection = await getCollection('puzzles');
  let reset = collection.remove({});

  const files = await fs.readdir(root)
  let jsons = Promise.all(files.map(loadFile(transformDB)));

  [reset, jsons] = await Promise.all([reset, jsons]);

  collection.insertMany(jsons, (err, results) => {
    console.log('err:', err);
    console.log('results:', results);
  });
};


const displayEntry = (entry) => {
  return { 
    title: entry.puzzle.title,
    date: entry.puzzle.date, 
    path: entry.path
  };
};

const entryCompare = (entryA, entryB) => {
  const dateA = unqualifyDate(entryA.path);
  const dateB = unqualifyDate(entryB.path);
  return dateB - dateA;
};

export const latestPuzzles = async (count) => {
  const collection = await getCollection('puzzles');
  const entries = await collection.find({}).toArray();
  entries.sort(entryCompare);
  const recent = entries.slice(0, count);
  return recent.map(displayEntry);
};

export const getPuzzle = (path) => {
  return new Promise(async (resolve, reject) => {
    const collection = await getCollection('puzzles');
    let result = await collection.find({path}).toArray();
    if (result.length === 0) {
      reject(result);
    }
    resolve(result[0]);
  });
};

populatePuzzleDatabase();
