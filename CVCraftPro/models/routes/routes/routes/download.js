const express = require('express');
const User = require('../models/User');
const router = express.Router();
const path = require('path');

router.get('/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user.hasPaid) return res.status(403).send('Payment required');

  res.download(path.join(__dirname, '../files/cv.pdf'));
});

module.exports = router;
router.get('/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (!user.hasPaid) return res.status(403).send('Payment required');
    res.download(path.join(__dirname, '../files/cv.pdf'));
});

