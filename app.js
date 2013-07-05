//http://www.readability.com/api/content/v1/parser?url=http://blog.readability.com/2011/02/step-up-be-heard-readability-ideas/&token=534c533ba76623af7c8eda028017782bfb5630e2

//var readability_token = "534c533ba76623af7c8eda028017782bfb5630e2";
//var readability_base_url = "http://www.readability.com/api/content/v1/parser?url=";




function getURLParameter(name) {
    return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);
}

function loadFeedInfo(feedURL, feedManager, feedList) {
	var xhr = new XMLHttpRequest({mozSystem: true});

	xhr.open("GET", feedURL, true);

	xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
        	console.log("Request OK");

        	var feedObject = jQuery.parseXML(xhr.response);

        	var rss2 = ($(feedObject).find("rss").text() === "") ? false : true;
        	var atom = ($(feedObject).find("feed").text() === "") ? false : true;
        	if (rss2) {
        		console.log("RSS2");

        		var feedTitle = $(feedObject).find("channel > title").text();

        		var feedLink = $(feedObject).find("channel > link").text();

        		var feedPubDate = $(feedObject).find("channel > pubDate").text();

        		var feedType = "RSS2";
        	}
        	if (atom) {
        		console.log("ATOM");

        		var feedTitle = $(feedObject).find("feed > title").text();

        		var feedLink = $(feedObject).find("feed > link").attr("href");

        		var feedPubDate = $(feedObject).find("feed > updated").text();

        		var feedType = "ATOM";
        	}
        	
        	console.log(feedTitle);

        	console.log(feedLink);

        	console.log(feedPubDate);

        	var feed = new Feed(feedTitle, feedLink, feedURL, feedPubDate, feedObject, feedType);

        	//feedList.push(feed);

        	var found = false;	

        	// Procura pelo feed na lista de feeds.
        	for (var i = 0; i < feedList.length; i++) {
        		// Caso o feed seja encontrado, verificar se a data de ataulização é superior a existente.
        		if (feedList[i].feed_url === feedURL) {
        			// Se o feed for encotrado na lista, a váriavel é atualizada para indicar a situação.
        			found = true;
        			if (feedList[i].pub_date !== feedPubDate) {
        				feedList[i] = feed;
        			}
        		}
        	};
        	// Caso o feed não seja encontrado, o feed é adicionado ao final da lista.
        	if (!found) {
        		feedList.push(feed);
        	}

        	feedManager.persistFeedList(feedList);

        	loadFeedList(feedList);

        	$("#user_feeds").show();
			$("#feed_view").hide();
			$("#add_feed").hide();



        }
    }

    xhr.onerror = function () {
		console.log("Request Error");
	}

	xhr.send();
}

function loadFeed(feedURL) {

	var xhr = new XMLHttpRequest({mozSystem: true});

	xhr.open("GET", feedURL, true);

	xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
        	console.log("Request OK");

        	var feed = jQuery.parseXML(xhr.response);
        	
        	var feedIndex = 0;

        	$(feed).find('item').each(function() {

        		var article = $("<article class='accordion-group article_item'></article>");
        		var header = $("<header class='accordion-heading'></header>");
        		var header_title = $("<h5></h5>");
        		var header_title_url = $("<a class='accordion-toggle article_title' data-toggle='collapse' data-parent='#feed_list' href='#collapse" + feedIndex + "'></a>");
        		//var article_image = $("<img class='article_image />'");
        		var section_content = $("<section id='collapse" + feedIndex +  "' class='article_content accordion-body collapse'></section>");
        		var section_content_inner = $("<div class='accordion-inner'></div>");

        		//$(header_title_url).attr("href", $(this).find('link').text())
        		$(header_title_url).text($(this).find('title').text());

        		$(section_content_inner).html($(this).find('description').text())
        		$(section_content).append(section_content_inner);

        		$(header_title).append(header_title_url);
        		$(header).append(header_title);
        		$(article).append(header);
        		$(article).append(section_content);

        		$("#feed_list").append(article);

        		feedIndex++;
        		
        	});

        }
	}

	xhr.onerror = function () {
		console.log("Request Error");
	}

	xhr.send();

}

function loadFeedList(feedList) {

	$("#feeds_list").html("");

	var feed_list_element = $("<ul class='nav nav-tabs nav-stacked'></ul>");

	if (feedList instanceof Array) {
		
		feedList.forEach(function(feed) {
			feed_item_li = $("<li></li>");
			feed_item_icon = $("<i class='icon-rss'></i>");
			feed_item_title = $("<a class='feed_item' href='#' data-target='" + feed.feed_link + "'></a>");
			$(feed_item_title).append(feed_item_icon);
			$(feed_item_title).append(" - <span>" + feed.feed_title + "</span><i class='icon-double-angle-right pull-right'></i>");

			$(feed_item_li).append(feed_item_title);
			$(feed_list_element).append(feed_item_li);
		});

		$("#feeds_list").append(feed_list_element);

	} 

	

}

var feedArray;

// Start Application
$(document).ready(function() {

	$("#user_feeds").show();
	$("#feed_view").hide();
	$("#add_feed").hide();

	if (window.mozIndexedDB) {
        window.indexedDB = window.mozIndexedDB;
        window.IDBKeyRange = window.IDBKeyRange;
        window.IDBTransaction = window.IDBTransaction;
	}

	feed_manager = new FeedManager();

	if ( feed_manager.loadFeedList() === undefined || feed_manager.loadFeedList() === null ) {
		feedArray = new Array();
		console.log("Novo Array");
	} else {
		feedArray = feed_manager.loadFeedList();
		console.log("Old Object");
	}

	// Carrega a lista de feeds do usuário
	loadFeedList(feedArray);

	$("#btn_add_feed").click(function() {
		$("#user_feeds").hide("fast");
		$("#feed_view").hide("fast");
		$("#add_feed").show("slow");
	});

	$("#btn_save_feed").click(function() {
		var feed_url = $("#feed_url").val();
		loadFeedInfo(feed_url, feed_manager, feedArray);
	});

	$("#menu_home").click(function() {
		$("#user_feeds").show();
		$("#feed_view").hide();
		$("#add_feed").hide();

		loadFeedList(feedArray);
	});

	$(".feed_item").click(function() {
		console.log($(this).attr("data-target"));
	});

	$("#btn_refresh").click(function() {

		//loadFeed("http://feeds.feedburner.com/meiobit");
		//http://www.theverge.com/rss/index.xml
		//http://feeds.feedburner.com/kotakubr
		//http://br-linux.org/feed

		//var redirect_url = getURLParameter("url");
		//var redirect_url = "http://www.polygon.com/2013/7/4/4493108/final-fantasy-7-now-available-on-steam";

		//var full_url = readability_base_url + redirect_url + "&token=" + readability_token;

		//var xhr = new XMLHttpRequest({mozSystem: true});
		// Faz a requisição para a URL desejada.
		//console.log(full_url);
		//xhr.open("GET", full_url, true);

		//console.log("Start Request");
		// Trata a resposta com sucesso
		/*xhr.onreadystatechange = function () {
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
	    }*/

	    // Trata a resposta com erro
	    /*xhr.onerror = function () {
	    	console.log("Request Error");
	    	$('#api_request').html("<h4>Result from Cross-domain XHR</h4><p>Cross-domain XHR failed</p>");
	    };

	    // Envia a requisição
	    xhr.send();*/
	});
	
	var activity = new MozActivity({
		name: "view",
		data: {
			type: "url"
		}
	});

	activity.onsuccess = function() {
		var url = this.result;
		console.log(url);
	};

	activity.onerror = function() {
		console.log(this.error);
	};
	
});

	
