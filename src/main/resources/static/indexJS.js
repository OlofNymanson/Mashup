/*
 * Här hämtas filmens "riktiga" titel från OMDB API. Titeln används för att kunna få rätt resultat från de andra API-sökningarna.
 * Om år anges så inkluderas det i sökningen för bättre resultat, annars söks det bara efter filmtitel.
 * Sen skapas rubriken för sökresultatet och kallar på metoden getMoviePoster
 */
function getMovieTitle(movieTitle, movieYear) {
	if (movieYear == "" || movieYear == "Year") {

		$.ajax(
				{
					url : 'https://omdbapi.com/?t=' + movieTitle
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
					url : 'https://omdbapi.com/?t=' + movieTitle + '&y='
							+ movieYear + '&plot=full&apikey=bbba3eae',
					headers : {
						"Accept" : "application/json"
					}
				}).done(
				function(data) {
					movieTitle = data['Title'];+
					$('#tableHeader').html(
							'Sökresultat för: ' + movieTitle + ' Från år: '
									+ movieYear);
				});

		getMoviePoster(movieTitle, movieYear);
	}
}

/*
 * Här hämtas filmens poster för sökresultatet på förstasidan.
 * Om år angavs i sökningen så inklduderas det i sökningen, annars inte.
 * Sedan placeras den och filmens titel i en tabell. Klickar man på bilden så kallas metoden getAllInfo.
 */
function getMoviePoster(movieTitle, movieYear) {
	var url;
	if (movieYear == "" || movieYear == "Year") {
		url = 'https://omdbapi.com/?t=' + movieTitle
				+ '&plot=full&apikey=bbba3eae';
	} else {
		url = 'https://omdbapi.com/?t=' + movieTitle + '&y=' + movieYear
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

/*
 * Här hämtas all info som behövs för infosidan från OMDB API. Sökningen görs med titeln man fick från metoden getMovieTitle.
 * Om år angetts så inkluderas det i sökningen. Den data som hämtas är titel, genre, år, speltid, imdb-betyg, handling, poster, skådespelare och regissör.
 * Datan som hämtas placeras i passande HTML-rubrik. Sedan kallas metoderna setHttpURL, getVideoId och getRelatedMovies.
 */
function getAllInfo(movieTitle) {
	$('#frontPage').hide(1000);

	var url;
	if (movieYear == "" || movieYear == "year") {
		url = 'https://omdbapi.com/?t=' + movieTitle
				+ '&plot=full&apikey=bbba3eae';
	} else {
		url = 'https://omdbapi.com/?t=' + movieTitle + '&y=' + movieYear
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
		$('#movieDirector').html('Regissör: ');
		$('#movieDirectorInfo').html(director);
		$('#movieActors').html('Skådespelare: ');
		$('#movieActorsInfo').html(actors);
		$('#movieGenre').html('Genre: ');
		$('#movieGenreInfo').html(genre);
		$('#movieYear').html('År: ');
		$('#movieYearInfo').html(year);
		$('#movieLength').html('Filmlängd: ');
		$('#movieLengthInfo').html(length);
		$('#movieRating').html('IMDB-betyg:');
		$('#movieRatingInfo').html(" " + rating);

		$('#moviePlot').html(plot);

		setHttpURL(title, year);
		getVideoId();
		getRelatedMovies(actors, title);

		$('#movieTitle').css('text-decoration','underline');
		$('#infoPage').show(1000);
	});
}

/*
 * metod som gömmer infosidan och visar förstasidan
 */
function hideInfoShowSearch() {
	$('#infoPage').hide(0);
	$('#frontPage').show(1000);

	$('#relatedMoviesTable').html('');
	player.destroy();
}

// för HttpREQ
var httpURL;
var videoId;

/*
 * skapar URLen som används för sökningen i Youtube-APIet.
 * URLen specifierar vad som ska vara med eller inte i resultatet. Resultatet utgår utifrån relevansen av sökningen.
 * Vad som ingår i sökningen är: titeln, året, 'official', 'movie', 'trailer'. 
 * Vad som inte får ingå är: 'honest', 'review', 'unofficial', 'teaser', 'clip', och ett par andra språk som brukar vara istället för engelska
 */
function setHttpURL(title, year) {
	var editTitle = title.split(' ').join('+');
	httpURL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q='
		+ editTitle
		+ '+'
		+ year
		+ '+official+movie+trailer+-honest+-review+-unofficial+-teaser+-gag+-bloopers+-espa\ñol+-russian+-italiano+-German+-Deutch+-Greek+-CZ+-PL+-clip&relevanceLanguage=en&type=video&videoDuration=short&videoEmbeddable=true&key=AIzaSyAV3CqSGsBZ-SiW90bzYfLrCf-lQgq9JZs';
}

/*
 * metod som hämtar trailerns videoId som behövs för att få fram rätt film ur Youtube-APIet.
 */
function getVideoId() {
	$.getJSON(httpURL, function(data) {
		videoId = data['items'][0]['id']['videoId'];
		startYT();
	});
}

// FÖR YOUTUBE
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

/*
 * metod som sätter igång skapar en YoutubePlayer som visar trailern
 */
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


/*
 * sätter igång trailern
 */
function onPlayerReady(event) {
	event.target.playVideo();
}


//FÖR RELATERADE FILMER

/*
 *	Metod som hämtar filmerna med gemensamma skådespelare.
 *	Inparametrarna är filmtiteln och 4 skådespelarena. Skådespelarna är (oftast) ordnade efter vilken roll de har i filmen (huvudpersonerna först).
 *	De första två skådespelarna används för anrop till TMDB APIet för att hämta ut högst 3 filmer var.
 *	När filmerna hämtas skickas deras titlar till metoden addRelatedMovie 
 */
function getRelatedMovies(actors, movieTitle){
	var actor = actors.split(", ");
	var url = 'https://api.tmdb.org/3/search/person?api_key=1ca35d6808f235b4bee12b69f15687ed&query='

	var movieArray = [];
	
	for(i = 0; i < actor.length / 2; i++){
		var editName = actor[i].split(' ').join('\%20');
		var editURL = '';
		editURL = url + editName;
		
		console.log(actor[i]);
		
		$.getJSON(editURL, function(data) {
			
			for(x = 0; x < 3; x++){
				var knownFor = data['results'][0]['known_for'][x]['original_title'];
				
				
				if(movieTitle != knownFor && !movieArray.includes(knownFor) && knownFor != null){	
					movieArray.push(knownFor);
					addRelatedMovie(knownFor);
				}
			}
		});
	}
}

/*
 *	Metod som hämtar de relaterade filmernas posters och titel från OMDB API och lägger dem i en tabell i infosidan.
 *	När man klickar på en av filmerna kallas metoderna resetInfoPage och getAllInfo med filmens titel som inparameter.
 */
function addRelatedMovie(title){
	$.ajax({
		url : 'https://omdbapi.com/?t=' + title
		+ '&apikey=bbba3eae',
		headers : {
			"Accept" : "application/json"
		}
	}).done(function(data) {
			poster = data['Poster'];
			newTitle = data['Title'];
			relatedMovie = '<td><img src="' + poster + '" onclick="resetInfoPage();getAllInfo(\'' + newTitle + '\')"></td>';
			$('#relatedMoviesTable').append(relatedMovie);	
	});
}

/*
 * nollställer tabellen med relaterade filmer och gömmer infosidan.
 */
function resetInfoPage(){
	$('#infoPage').hide(0);
	player.destroy();
	$('#relatedMoviesTable').html('<tr></tr>');
}
