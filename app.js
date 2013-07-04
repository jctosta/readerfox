//http://www.readability.com/api/content/v1/parser?url=http://blog.readability.com/2011/02/step-up-be-heard-readability-ideas/&token=534c533ba76623af7c8eda028017782bfb5630e2

var readability_token = "534c533ba76623af7c8eda028017782bfb5630e2";
var readability_base_url = "http://www.readability.com/api/content/v1/parser?url=";

function getURLParameter(name) {
    return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);
}


// Start Application
$(document).ready(function() {

	$("#btn_refresh").click(function() {
		//var redirect_url = getURLParameter("url");
		var redirect_url = "http://www.polygon.com/2013/7/4/4493108/final-fantasy-7-now-available-on-steam";

		var full_url = readability_base_url + redirect_url + "&token=" + readability_token;

		var xhr = new XMLHttpRequest({mozSystem: true});
		// Faz a requisição para a URL desejada.
		console.log(full_url);
		xhr.open("GET", full_url, true);

		console.log("Start Request");
		// Trata a resposta com sucesso
		xhr.onreadystatechange = function () {
	        if (xhr.status === 200 && xhr.readyState === 4) {
	        	console.log("Request OK");
	        	var article = jQuery.parseJSON(xhr.response);
	        	console.log(xhr.response);

	        	$("#article_title").attr("href", article.url);
	        	$("#article_title").html(article.title);

	        	$("#article_image").attr("src", article.lead_image_url);
	        	
	        	$("#article_content").html(article.content);
	            //crossDomainXHRDisplay.innerHTML = "<h4>Result from Cross-domain XHR</h4>" + xhr.response;
	            //crossDomainXHRDisplay.style.display = "block";
	        }
	    }

	    // Trata a resposta com erro
	    xhr.onerror = function () {
	    	console.log("Request Error");
	    	$('#api_request').html("<h4>Result from Cross-domain XHR</h4><p>Cross-domain XHR failed</p>");
	        //crossDomainXHRDisplay.innerHTML = "<h4>Result from Cross-domain XHR</h4><p>Cross-domain XHR failed</p>";
	        //crossDomainXHRDisplay.style.display = "block";
	    };

	    // Envia a requisição
	    xhr.send();
	});

	
});

	
