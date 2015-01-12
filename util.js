var app = {};

app.shorten = function(text, maxLength) {
	if(maxLength == null)
		maxLength = 300;

    var ret = text;
    if (ret.length > maxLength) {
        ret = ret.substr(0,maxLength-3) + '&hellip;';
    }
    return ret;
}

app.hasLoggedIn = function(req){
	try{
		return req.session.user.id;
	} catch(e) {
		return false;
	}
}

app.goBack = function(req, res){
	res.redirect(req.header('Referer') || '/');
}

module.exports = app;