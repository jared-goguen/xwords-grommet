import fs from 'fs';
import axios from 'axios';
import xml2js from 'xml2js';

const root = 'data';

const qualifyPath = path => `${root}/${path}`;

const fetchPuzzleXML = (path, callback) => {
  const url = `https://www.xwordinfo.com/xml/Puzzles/2018/${path}.xml`;
  axios.get(url)
    .then(response => callback(response))
    .catch(error => console.log(error));
};

const convertPuzzleXML = (path, callback) => {
  fetchPuzzleXML(path, (response) => {
    xml2js.parseString(response.data, (err, json) => {
      callback(json);
    });
  });
};

const savePuzzle = (path) => {
  convertPuzzleXML(path, (json) => {
    fs.writeFile(qualifyPath(`${path}.json`), JSON.stringify(json));
  });
};

const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
const qualifyDate = (date) => {
  let day = date.getDate();
  day = day < 10 ? `0${day}` : day;
  return `${months[date.getMonth()]}${day}-${date.getFullYear()}`;
};

const unqualifyDate = (qDate) => {
  const [month, day, year] = qDate.match(/([A-Za-z]{3})([0-9]{2})-([0-9]{4})/);
  return new Date(year, months.indexOf(month), day);
};

const updatePuzzles = (date) => {
  const qDate = qualifyDate(date);
  const qPath = qualifyPath(qDate);

  fs.stat(`${qPath}.json`, (err) => {
    if (err) {
      savePuzzle(qDate);
      date.setDate(date.getDate() - 1);
      updatePuzzles(date);
    }
  });
};

const fileCompare = (a, b) => {
  const dateA = unqualifyDate(a);
  const dateB = unqualifyDate(b);

  if (dateA < dateB) {
    return 1;
  }

  if (dateA > dateB) {
    return -1;
  }

  return 0;
};

const mostRecentFiles = (files, count) => {
  const sortedFiles = files.slice(0, 3).sort(fileCompare);
  return sortedFiles.slice(0, count);
};

console.log(mostRecentFiles(fs.readdirSync('data'), 10));

