var express = require('express');
var router = express.Router();

router.post('/add/:id',function(req,res){
	var db = req.db().query('INSERT INTO comments (post_id,user_id,body) VALUES (?,?,?);',[req.params.id,0,req.body.body],function(err){
		if(err)
			res.json([err,db.sql]);
		res.redirect('/posts/'+req.params.id);
	});
});

module.exports = router;