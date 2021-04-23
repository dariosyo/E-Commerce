const express = require('express');
const usersRepo = require('../../repositories/users');
const signinTemplet = require('../../views/admin/auth/signin');
const signupTemplet = require('../../views/admin/auth/signup');

const router = express.Router();





      router.get('/signup', (req, res) => {
        res.send(signupTemplet())
      });

      // Sign up congig
      router.post('/signup', async (req, res) => {
        const {
          email,
          password,
          passwordConfirmation
        } = req.body;
        const existingUser = await usersRepo.getOneBy({
          email: email
        });

        if (existingUser) {
          return res.send("Email in use");
        }

        if (password !== passwordConfirmation) {
          return res.send("Password must much");
        }

        const user = await usersRepo.create({
          email,
          password
        }); //({ email: email, password: password});

        req.session.userId = user.id; // Store the ID of that user inside users cookie

        res.send('Account created');
      });

      router.get('/signoff', (req, res) => {
        req.session = null;
        res.send('You are logged off')
      });

      router.get('/signin', (req, res) => {

        res.send(signinTemplet());
      });

      router.post('/signin', async (req, res) => {
        const {
          email,
          password
        } = req.body;
        const user = await usersRepo.getOneBy({
          email
        });

        if (!user) {
          return res.send("Email not found");
        }

        const validPassword = await usersRepo.comparePasswords(user.password, password);


        if (!validPassword) {
          return res.send("Invalid password");
        }

        req.session.userId = user.id;

        res.send("You are logged in");
      });

  module.exports = router;
