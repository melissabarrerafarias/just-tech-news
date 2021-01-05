const router = require('express').Router();
const sequelize = require('../config/connection'); 
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    console.log(req.session);
    Post.findAll({
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        // pass a single post object into the homepage template
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('homepage', { posts });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.get('/login', (req, res) => {
    res.render('login');
  });


module.exports = router;

// before we would use the res.send() or res.sendFile() for the response of html. But, becuase we've hooked up a template engine, we can now use 
// res.render() and specify which template we want to use. In this case, we want to render the homepage.handlebars template (the .handlebars
// extension is implied). 

// res.render('homepage', {
//     id: 1,
//     post_url: 'https://handlebarsjs.com/guide/',
//     title: 'Handlebars Docs',
//     created_at: new Date(),
//     vote_count: 10,
//     comments: [{}, {}],
//     user: {
//         username: 'test_user'
//     }
// });
// in this case we case we are taking a single post object and passing it to the homepage.handlebars template. Each property on the object becomes
// available in the template using the Handlebars.js {{}} syntax.