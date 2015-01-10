var express = require('express');
var _ 		= require('underscore');
var router 	= express.Router();

router.get('',function(req,res){
	req.db().query('SELECT * FROM users',function(err,rows,fields){
		var users = rows;
		res.render('user/index',{"users":users,"isAdded":(typeof req.query.added !== 'undefined')});
	});
});

router.get('/create',function(req,res){
	res.render('user/create');
});

router.post('/create',function(req,res){
	req.db().query('INSERT INTO users (username,email,password) VALUES (?,?,?)',
		[req.body.username,req.body.email,req.body.password],function(err,result){
			if(err)
				res.send('an error accured')
			else{
				res.redirect('/user?added=1');
			}
		});

	// res.send('added! ;)')
});

router.post('/is_user',function(req,res){
	var q = req.db().query('SELECT id FROM users WHERE username=?',[req.body.username],function(err,result){
		res.json(q.sql);

		// if(result !== {})
		// 	res.send(result + err);
		// else
		// 	res.send(result + err);
	})
});

module.exports = router;