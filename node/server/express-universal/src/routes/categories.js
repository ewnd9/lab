import express from 'express';

const router = express.Router();

router.get('/api/v1/categories', (req, res) => {
  res.json(['main', 'about'].map((title, i) => ({ id: i + 1, title })));
});

export default router;
