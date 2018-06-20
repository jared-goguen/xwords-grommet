const populatePuzzleDatabase = require('./puzzles').populatePuzzleDatabase;

(async () => {
  await populatePuzzleDatabase();
  setTimeout(process.exit, 1000);
})();