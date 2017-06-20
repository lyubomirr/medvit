'use strict';

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Account = require('../models/Account');
const isAuthed = require('../config/isAuthed');

router.post('/', isAuthed, (req, res) => {
  Account
    .findById(req.user.id)
    .populate('employee')
    .then((user) => {
      let newPost = new Post({
        poster: {
          id: req.user.id,
          image: user.employee.photo,
          first_name: user.employee.firstName,
          last_name: user.employee.lastName
        },
        body: req.body.postContent,
        date: new Date()
      });

      newPost
        .save()
        .then(() => {
          return res.send(newPost);
        })
        .catch((err) => {
          console.log(err);
          return res.redirect('/');
        });
    })
    .catch((err) => {
      console.log(err);
      return res.redirect('/');
    });
});

router.get('/delete/:postid', (req, res) => {
  let postid = req.params.postid;
  Account
    .findById(req.user.id)
    .populate('employee')
    .then((user) => {
      Post
        .findById(postid)
        .then((post) => {
          if (post.poster.id === req.user.id || user.employee.role === 'administrator') {
            post.remove()
            .then(() => {
              return res.send('Post successfully removed!');
            })
            .catch((err) => {
              console.log(err);
              return res.redirect('/');
            });
          } else {
            return res.send('Unauthorized!');
          }
        })
    .catch((err) => {
      console.log(err);
      return res.redirect('/');
    });
    });
});

module.exports = router;
