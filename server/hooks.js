const populatePuzzleDatabase = require('./puzzles').populatePuzzleDatabase;

(async () => {
  await populatePuzzleDatabase();
})();