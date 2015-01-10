var express = require('express');
var router = express.Router();

router.get(['','/posts/index','/posts'],function(req,res){
	req.db().query('SELECT * FROM posts',function(err,posts){
		var p = posts;
		res.render('posts/index',{"posts":p});
	});
});

router.get('/posts/create',function(req,res){
	res.render('posts/create');
});

router.post('/posts/create',function(req,res){
	req.db().query('INSERT INTO posts (author_id,title,body) VALUES (?,?,?)',[1,req.body.title,req.body.body],function(){
		res.redirect('/?post_added=1');
	});
});

router.get('/posts/:id',function(req,res,next){
	var db = req.db().query('SELECT * FROM posts WHERE id=?',[req.params.id],function(err,post){
		res.render('posts/post',{"post":post[0]});
	});
});

module.exports = router;