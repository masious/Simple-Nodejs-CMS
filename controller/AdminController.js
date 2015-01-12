var express = require('express');
var cookieParser = require('cookie-parser');
var sessionParser = require('express-session');
var utils = require('../util.js');
var router = express.Router();

router.use(sessionParser({
	secret: '1234567890QWERTY',
	resave: false,
	saveUninitialized: false
}));

//	authentication
router.use(function(req,res,next){
	console.log('checking '+req.url+' ...');
	var publicPages = ['/','/login'];
	if(publicPages.indexOf(req.url)>=0)
		next();
	else if(utils.hasLoggedIn(req)){
		next();
	}
	else{
		next();
		// res.status(403).send('Not Authorized');
	}
});

// public pages
router.get(['/login','/'],function(req,res,next){
	res.render('admin/login');
});

// admin pages
router.post('/login',function(req,res){
	req.db().query('SELECT * FROM users WHERE username=? AND password=?',
	[req.body.username,req.body.password],
	function(err,user){
		if(err)
			res.json(err);
		else{
			req.session.user = user[0];
			res.redirect('panel');
		}
	});
});

router.get('/panel',function(req,res){
	res.render('admin/panel')
});

router.get('/posts/create',function(req,res){
	res.render('admin/post_create');
});
router.post('/posts/create',function(req,res){
	req.db().query('INSERT INTO posts (author_id,title,body) VALUES (?,?,?)',
		[req.session.user.id, req.body.title, req.body.body], function(){
		res.redirect('/admin/posts');
	});
});

router.get('/posts',function(req,res){
	req.db().query('SELECT * FROM posts ORDER BY id DESC',function(err,posts){
		for(var post in posts){
			posts[post].body = utils.shorten(posts[post].body);
		}
		res.render('admin/posts',{posts: posts});
	})
});

router.get('/comments/accept/:id',function(req,res){
	req.db().query('UPDATE comments SET is_accepted=? WHERE id=?',[1,req.params.id],function(err){
		utils.goBack(req,res);
	});
});

router.get('/comments',function(req,res){
	req.db().query(
		'SELECT comments.*,posts.title FROM comments LEFT JOIN posts ON comments.post_id=posts.id ORDER By comments.id DESC',function(err,comments){
		res.render('admin/comments',{comments: comments});
	});
});

router.get('/post',function(req,res){

});

module.exports = router;