
function getMovieTitle(movieTitle, movieYear) {
	if (movieYear == "" || movieYear == "Year") {

		$.ajax(
				{
					url : 'http://omdbapi.com/?t=' + movieTitle
							+ '&plot=full&apikey=bbba3eae',
					headers : {
						"Accept" : "application/json"
					}
				}).done(function(data) {
			movieTitle = data['Title'];
			$('#tableHeader').html('Sökresultat för: ' + movieTitle);
		});

		getMoviePoster(movieTitle);

	} else {
		$.ajax(
				{
					url : 'http://omdbapi.com/?t=' + movieTitle + '&y='
							+ movieYear + '&plot=full&apikey=bbba3eae',
					headers : {
						"Accept" : "application/json"
					}
				}).done(
				function(data) {
					movieTitle = data['Title'];
					$('#tableHeader').html(
							'Sökresultat för: ' + movieTitle + ' Från år: '
									+ movieYear);
				});

		getMoviePoster(movieTitle, movieYear);

	}

}

function getMoviePoster(movieTitle, movieYear) {

	var url;
	if (movieYear == "" || movieYear == "Year") {
		url = 'http://omdbapi.com/?t=' + movieTitle
				+ '&plot=full&apikey=bbba3eae';
	} else {
		url = 'http://omdbapi.com/?t=' + movieTitle + '&y=' + movieYear
				+ '&plot=full&apikey=bbba3eae';
	}

	$.ajax({
		url : url,
		headers : {
			"Accept" : "application/json"
		}
	}).done(
			function(data) {
				poster = data['Poster'];
				title = data['Title'];


				if (title == null) {
					table = '<tr><td><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Red_X.svg/2000px-Red_X.svg.png"></td></tr>'
							+ '<tr><td>Ingen film hittad</td></tr>';
				} else {
					table = '<tr><td><img src="' + poster
							+ '" onclick="getAllInfo(\'' + title
							+ '\')"></td></tr>' + '<tr><td>' + title
							+ '</td></tr>';

				}

				$('#movieTable').html(table);
			});
}

function getAllInfo(movieTitle) {
	console.log(movieTitle);
	$('#frontPage').hide(1000);

	var url;
	if (movieYear == "" || movieYear == "year") {
		url = 'http://omdbapi.com/?t=' + movieTitle
				+ '&plot=full&apikey=bbba3eae';
	} else {
		url = 'http://omdbapi.com/?t=' + movieTitle + '&y=' + movieYear
				+ '&plot=full&apikey=bbba3eae';
	}

	$.ajax({
		url : url,
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
		actors = data['Actors'];
		director = data['Director'];

		$('#moviePoster').html('<img src="' + poster + '">');
		$('#movieTitle').html(title);
		$('#movieDirector').html('Regissör: ' + director);
		$('#movieActors').html('Skådespelare: ' + actors);
		$('#movieGenre').html('Genre: ' + genre);
		$('#movieYear').html('År: ' + year);
		$('#movieLength').html('Filmlängd: ' + length);
		$('#movieRating').html('IMDB-betyg: ' + rating);
		$('#moviePlot').html(plot);

		setHttpURL(title, year);
		getXML();
		getRelatedMovies(actors);

		$('#movieTitle').css('text-decoration','underline');
		$('#infoPage').show(1000);
	});
}

function getRelatedMovies(actors){
	var actor = actors.split(", ");
	var url = 'http://api.tmdb.org/3/search/person?api_key=1ca35d6808f235b4bee12b69f15687ed&query='
	

	var movieArray = [];
	
	for(i = 0; i < actor.length / 2; i++){
		var editName = actor[i].split(' ').join('\%20');
		var editURL = '';
		editURL = url + editName;
		
		$.getJSON(editURL, function(data) {
			
			for(x = 0; x < 3; x++){
				var knownFor = data['results'][0]['known_for'][x]['original_title'];
				
				if(theMovieTitle != knownFor && !movieArray.includes(knownFor)){	
					movieArray.push(knownFor);
				}
			}
		});
	}
	
	console.log(movieArray);
	
	var length = movieArray.length;
	
	for(i = 0; i < 3; i++){
		console.log(movieArray[i]);
	}
}

function hideInfoShowSearch() {
	$('#infoPage').hide(1000);
	$('#frontPage').show(1000);

	player.destroy();
}

// för HttpREQ
var httpURL;
var videoId;

function setHttpURL(title, year) {
	var editTitle = title.split(' ').join('+');
	httpURL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q='
		+ editTitle
		+ '+'
		+ year
		+ '+official+movie+trailer+-honest+-review+-unofficial+-teaser&type=video&videoDefinition=standard&videoDuration=short&videoEmbeddable=true&key=AIzaSyAV3CqSGsBZ-SiW90bzYfLrCf-lQgq9JZs';
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

function startYT() {
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