var app = {};

app.shorten = function(text, maxLength) {
	if(maxLength == null)
		maxLength = 300;

    var ret = text;
    if (ret.length > maxLength) {
        ret = ret.substr(0,maxLength-3) + '...';
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

app.goBack = function(req, res, data){
	var url = req.header('Referer') || '/';
	if(data)
		url += '?'+data+'=1';
	
	res.redirect(url);
}

module.exports = app;