import fetch from 'node-fetch';
import fs from 'fs-extra';
import xml2js from 'xml2js';
import Promise from 'bluebird';

const parseXMLString = Promise.promisify(xml2js.parseString);

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
  fs.writeFile(qualifyPath(`${path}.json`), JSON.stringify(json));
};

const updatePuzzles = async (date) => {
  const qDate = qualifyDate(date);
  const qPath = qualifyPath(qDate);

  try {
    await fs.stat(`${qPath}.json`);
  } catch (err) {
    await savePuzzle(qDate);
    date.setDate(date.getDate() - 1);
    updatePuzzles(date);
  }
};

const fileCompare = (a, b) => {
  const dateA = unqualifyDate(a);
  const dateB = unqualifyDate(b);
  return dateB - dateA;
};

const mostRecentFiles = (files, count) => {
  const sortedFiles = files.slice();
  sortedFiles.sort(fileCompare);
  return sortedFiles.slice(0, count);
};

const transformDataDisplay = (data) => {
  const puzzle = JSON.parse(data).Puzzles.Puzzle[0];
  return {
    title: puzzle.Title[0],
    date: puzzle.Date[0]
  };
};

const loadFile = (transform) => async (file) => {
  let data = await fs.readFile(`${root}/${file}`, 'utf-8');
  return transform(data);
};

export const mostRecentPuzzles = async (count) => {
  let files = await fs.readdir(root)
  const recent = mostRecentFiles(files, count);
  return Promise.all(recent.map(loadFile(transformDataDisplay)));
}
