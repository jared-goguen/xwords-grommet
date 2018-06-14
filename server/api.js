import express from 'express';
import { addSession, getTasks, getTask } from './data';
import { mostRecentPuzzles } from './puzzles';

const router = express.Router();

router.post('/sessions', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || email === 'error') {
    res.statusMessage = 'Invalid email or password';
    res.status(401).end();
  } else {
    const name = email.split('@')[0].replace(/\.|_/, ' '); // simulated
    const now = new Date();
    const token = `token-${now.getTime()}`; // simulated
    const session = { email, name, token };
    addSession(token, session);
    res.json(session);
  }
});

router.get('/task', (req, res) => {
  getTasks(req.query).then(tasks => res.json(tasks));
});

router.get('/task/:id', (req, res) => {
  getTask(req.params.id).then((result) => {
    if (!result.task) {
      res.status(404).end();
    } else {
      res.json(result);
    }
  });
});

router.get('/recent/:count', (req, res) => {
  mostRecentPuzzles(req.params.count).then((results) => {
    res.json({puzzles: results});
  });
});

router.delete('/sessions/*', (req, res) => {
  res.json(undefined);
});



module.exports = router;
