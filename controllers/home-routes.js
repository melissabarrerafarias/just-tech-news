const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('homepage');
}); 


module.exports = router;

// before we would use the res.send() or res.sendFile() for the response of html. But, becuase we've hooked up a template engine, we can now use 
// res.render() and specify which template we want to use. In this case, we want to render the homepage.handlebars template (the .handlebars
// extension is implied). 