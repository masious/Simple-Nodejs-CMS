var express = require('express');
var cookieParser = require('cookie-parser');
var sessionParser = require('express-session');
var stripTags = require('striptags');
var utils = require('../util.js');
var router = express.Router();

router.use(sessionParser({
	secret: '1234567890QWERTY',
	resave: true,
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
	res.render('admin/post_create',{post: {title:'',body:''}});
});
router.post('/posts/create',function(req,res){
	req.db().query('INSERT INTO posts (author_id,title,body) VALUES (?,?,?)',
		[1, req.body.title, req.body.body], function(){
		res.redirect('/admin/posts?created=1');
	});
});

router.get('/posts',function(req,res){
	var viewVars = {};
	if(typeof req.query.edit != 'undefined')
		viewVars['success'] = 'Edited post, saved successfully.';
	if(typeof req.query.created != 'undefined')
		viewVars['success'] = 'New post created successfully.';
	
	req.db().query('SELECT * FROM posts ORDER BY id DESC',function(err,posts){
		for(var post in posts){
			posts[post].body = utils.shorten(stripTags(posts[post].body,{allowedTags:false,allowedAttributes: false})).replace('&nbsp;',' ');
		}
		viewVars['posts'] = posts;
		res.render('admin/posts',viewVars);
	})
});

router.get('/posts/:id',function(req,res){
	req.db().query('SELECT * FROM posts WHERE id=?',[req.params.id],function(err,posts){
		res.render('admin/post_create',{post: posts[0]});
	});
});
router.post('/posts/:id',function(req,res){
	var post = req.body;
	req.db().query('UPDATE posts SET title=?,body=? WHERE id=?',[post.title,post.body,req.params.id],function(err){
		res.redirect('/admin/posts?edit=1')
	});
})

router.get('/comments/accept/:id',function(req,res){
	req.db().query('UPDATE comments SET is_accepted=? WHERE id=?',[1,req.params.id],function(err){
		utils.goBack(req,res,'accepted');
	});
});

router.get('/comments',function(req,res){
	var viewVars = {};
	if(typeof req.query.accepted != 'undefined')
		viewVars['success'] = 'Comment accepted successfully.';

	req.db().query(
		'SELECT comments.*,posts.title FROM comments LEFT JOIN posts ON comments.post_id=posts.id ORDER By comments.id DESC',function(err,comments){
			viewVars['comments'] = comments;
			viewVars['commentsCount'] = comments.length;
			res.render('admin/comments',viewVars);
	});
});

router.get('/post',function(req,res){

});

module.exports = router;