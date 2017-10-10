function getMovieTitle(movieTitle) {
	$.ajax({
		url : 'http://www.omdbapi.com/?t=' + movieTitle + '&apikey=bbba3eae',
		headers : {
			"Accept" : "application/json"
		}
	}).done(function(data) {
		title = data['Title'];
		$('#tableHeader').html('Sökresultat för: ' + title);
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