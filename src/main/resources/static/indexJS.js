function getMovieTitle(movieTitle) {
	$.ajax({
		url : 'http://omdbapi.com/?t=' + movieTitle + '&apikey=bbba3eae',
		headers : {
			"Accept" : "application/json"
		}
	}).done(function(data) {
		movieTitle = data['Title'];
		$('#tableHeader').html('Sökresultat för: ' + movieTitle);
	});

	getMoviePoster(movieTitle);
}

function getMoviePoster(movieTitle) {
	$.ajax({
		url : 'http://omdbapi.com/?t=' + movieTitle + '&apikey=bbba3eae',
		headers : {
			"Accept" : "application/json"
		}
	}).done(
			function(data) {
				poster = data['Poster'];
				title = data['Title'];
				row = '<tr><th><img src="' + poster
						+ '" onclick="getAllInfo(\'' + title
						+ '\')"/></th><td>' + title + '</td></tr>';

				$('#movieTable').html(row);
			});
}

function getAllInfo(movieTitle) {
	$('#frontPage').hide(1000);

	$.ajax({
		url : 'http://omdbapi.com/?t=' + movieTitle + '&apikey=bbba3eae',
		headers : {
			"Accept" : "application/json"
		}
	}).done(function(data) {
		title = data['Title'];
		genre = data['Genre'];
		year = data['Year'];
		length = data['Runtime'];
		rating = data['imdbRating'];
		plot = data['Plot'];
		poster = data['Poster'];

		$('#moviePoster').html('<img src="' + poster + '">');
		$('#movieTitle').html('Titel: ' + title);
		$('#movieGenre').html('Genre: ' + genre);
		$('#movieYear').html('År: ' + year);
		$('#movieLength').html('Filmlängd: ' + length);
		$('#movieRating').html('IMDB-betyg: ' + rating);
		$('#moviePlot').html(plot);

		getXML();

		$('#infoPage').show(1000);
	});
}

function hideInfoShowSearch() {
	$('#infoPage').hide(1000);
	$('#frontPage').show(1000);
}

// för HttpREQ
var httpURL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q=Baby+Driver+official+trailer+-honest+-review&type=video&videoDefinition=any&videoDuration=short&videoEmbeddable=true&key=AIzaSyAV3CqSGsBZ-SiW90bzYfLrCf-lQgq9JZs';
var videoId;

function httpGet(theUrl) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", theUrl, false); // false for synchronous request
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

function getXML() {
	$.getJSON(httpURL, function(data) {
		videoId = data['items'][0]['id']['videoId'];
		startYT();
	});

}

// FÖR IFRAME
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;


function startYT(){
	player = new YT.Player('player', {
		height : '600',
		width : '800',
		videoId : videoId,
		events : {
			'onReady' : onPlayerReady,
		}
	});
}

function onPlayerReady(event) {
	event.target.playVideo();
}