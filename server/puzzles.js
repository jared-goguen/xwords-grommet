import fs from 'fs';
import xml2js from 'xml2js';
import async from 'async';

const root = 'server/data';

const qualifyPath = path => `${root}/${path}`;

const fetchPuzzleXML = (path) => {
  return new Promise((resolve, reject) => {
    const url = `https://www.xwordinfo.com/xml/Puzzles/2018/${path}.xml`;  
    fetch(url).then(response => resolve(response.data)).catch(reject);
  }); 
};

const convertPuzzleXML = (xmlString) => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xmlString, (err, json) => {
      if (err) {
        reject(err);
      } else {
        resolve(json);
      }
    });
  });
};

const savePuzzle = (path) => {
  return new Promise((resolve, reject) => {
    fetchPuzzleXML(path)
      .then(convertPuzzleXML)
      .then((json) => {
        fs.writeFile(qualifyPath(`${path}.json`), JSON.stringify(json))
      })
      .then(resolve)
      .catch(reject);  
  });
};

const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
const qualifyDate = (date) => {
  let day = date.getDate();
  day = day < 10 ? `0${day}` : day;
  return `${months[date.getMonth()]}${day}-${date.getFullYear()}`;
};

const unqualifyDate = (qDate) => {
  const [_, month, day, year] = qDate.match(/([A-Za-z]{3})([0-9]{2})-([0-9]{4})/);
  return new Date(year, months.indexOf(month), day);
};

const updatePuzzles = (date) => {
  const qDate = qualifyDate(date);
  const qPath = qualifyPath(qDate);

  fs.stat(`${qPath}.json`, (err) => {
    if (err) {
      savePuzzle(qDate).then(() => {
        date.setDate(date.getDate() - 1);
        updatePuzzles(date);          
      });
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
  const sortedFiles = files.slice();
  sortedFiles.sort(fileCompare);
  let mostRecent = sortedFiles.slice(0, count);
  return mostRecent;
};

const transformDataDisplay = (data) => {
  let puzzle = JSON.parse(data).Puzzles.Puzzle[0];
  return {
    title: puzzle.Title[0],
    date: puzzle.Date[0]
  };
}

const loadFile = (file, next) => {
  fs.readFile(`${root}/${file}`, 'utf-8', (err, data) => {
    next(false, transformDataDisplay(data));
  });
};

export const mostRecentPuzzles = (count) => {
  return new Promise((resolve, reject) => {
    fs.readdir(root, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const recent = mostRecentFiles(files, count);
        async.map(recent, loadFile, (err, results) => resolve(results));
      }
    });
  });
};


