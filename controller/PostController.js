var express = require('express');
var router = express.Router();

router.get(['','/posts/index','/posts'],function(req,res){
	req.db().query('SELECT * FROM posts ORDER BY id DESC',function(err,posts){
		var p = posts;
		res.render('posts/index',{"posts":p});
	});
});

router.get('/posts/:id',function(req,res,next){
	var db = req.db().query('SELECT * FROM posts WHERE id=?',[req.params.id],function(err,post){
		req.db().query('SELECT * FROM comments WHERE post_id=?',[req.params.id],function(err,comments){
			res.render('posts/post',{"post":post[0],"comments": comments});	
		})
		
	});
});

module.exports = router;