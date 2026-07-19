const express = require('express');
const router = express.Router();
const WebUser = require('../../models/WebUser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', async (req, res) => {
  try {
    const user = await WebUser.findById(req.session.userId);
    if (!user || user.guildIds !== 'all') {
      req.session.message = 'Du bist dazu nicht berechtigt!';
      return res.redirect('/');
    }
    const allUsers = await WebUser.find({}).select('-password -__v').lean();
    res.render('user-management', {
      allUsers: allUsers,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.render('user-management', {
      allUsers: null,
      error: error.message,
    });
  }
});

router.post('/delete', async (req, res) => {
  const { userId } = req.body;
  await WebUser.findByIdAndDelete(userId);
  res.redirect('/user-management');
});

router.post('/create', async (req, res) => {
  const { name, password, serverids } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = new WebUser({
    user: name,
    password: hashedPassword,
    guildIds: serverids,
  });
  await newUser.save();
  res.redirect('/user-management');
});

module.exports = router;
