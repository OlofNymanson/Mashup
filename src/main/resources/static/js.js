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
				row = '<tr><th><a href="infoPage.html"><img src="' + poster
						+ '"></img></th><td>' + title + '</td></tr></a>';

				$('#movieTable').html(row);
			});
}

function getAllInfo() {
	$.ajax({
//		url : 'http://omdbapi.com/?t=' + movieTitle + '&apikey=bbba3eae',
		url: 'http://omdbapi.com/?t=Batman&apikey=bbba3eae',
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
				
		 $('#moviePoster').html('<img src="' + poster + '"/>');
		 $('#movieTitle').html(title);
		 $('#movieGenre').html(genre);
		 $('#movieYear').html(year);
		 $('#movieLength').html(length);
		 $('#movieRating').html(rating);
		 $('#moviePlot').html(plot);
	});
}