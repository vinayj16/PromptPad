import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ id: 1, title: 'Sample Template', content: 'This is a sample template.' });
});

export default router; 