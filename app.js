//http://www.readability.com/api/content/v1/parser?url=http://blog.readability.com/2011/02/step-up-be-heard-readability-ideas/&token=534c533ba76623af7c8eda028017782bfb5630e2

var readability_token = "534c533ba76623af7c8eda028017782bfb5630e2";
var readability_base_url = "http://www.readability.com/api/content/v1/parser?url=";

function getURLParameter(name) {
    return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);
}


// Start Application
$(document).ready(function() {

	var redirect_url = getURLParameter("url");

	var full_url = readability_base_url + redirect_url + "&token=" + readability_token;

	$.get(full_url, function(data) {
		alert(data);
	});

});

