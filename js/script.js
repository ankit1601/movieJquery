$(function() {
	$('#searchResults').hide();
	// ****************AJAX call and code for search of movie with title and displaying the results**************
	$('#search').on('click', function(e) {
		e.preventDefault();
		var answer = confirm("you searched for " + $('#searchOption').val());
		var searchValue = $('#searchOption').val();
		var urlLink = 'http://www.omdbapi.com/?s=' + searchValue;
		var myData = [];
		var title, poster, type, year;
		if (answer === true) {
			$.ajax({
				type: 'GET',
				url: urlLink,
				dataType: 'json',
				success: function(data) {
					$('#myCarousel').hide();
					$('#resultValues').empty();
					$('#searchResults').show();
					if (data.Response === "True") {
						$.each(data, function(value) {
							if (value === 'Search') {
								myData = data.Search;
							}
						});
						console.log(myData);
						$.each(myData, function(index) {
							var obj = myData[index];
							if (obj.Poster == "N/A") {
								obj.Poster = "./../images/default.jpg";
							}
							var movieTemplate = '<div class="col-lg-4 col-md-6 col-sm-6 movie"><div class="panel panel-primary"><div class="panel-heading panelTitleHeight"><h3 class="panel-title">{{Title}}</h3></div><img src="{{Poster}}" class="img-responsive center-block" style="height:400px" alt="image not Available"/><div class="panel-body">Year:{{Year}}<br>type:{{Type}}</div><button class="btn btn-info btn-block" type="button" id="movieInfo">Click Here More Information</button></div></div>';
							//$('#resultValues').append('<div class="col-lg-4 movie"><div class="panel panel-primary"><div class="panel-heading panelTitleHeight"><h3 class="panel-title">' + title + '</h3></div><img src="' + poster + '" class="img-responsive center-block" style="height:400px" alt="image not Available"/><div class="panel-body">Year: ' + year + '<br>type:' + type + '</div></div></div>');
							$('#resultValues').append(Mustache.render(movieTemplate, obj));
						});
						//how much items per page to show  
						var show_per_page = 6;
						//getting the amount of elements inside content div  
						var number_of_items = $('#resultValues').children().length;
						//calculate the number of pages we are going to have  
						var number_of_pages = Math.ceil(number_of_items / show_per_page);
						if (number_of_pages === 1) {
							$('#page_navigation').hide();
						} else {
							$('#page_navigation').show();
						}
						//set the value of our hidden input fields  
						$('#current_page').val(0);
						$('#show_per_page').val(show_per_page);
						/* 
						what are we going to have in the navigation? 
						    - link to previous page 
						    - links to specific pages 
						    - link to next page 
						*/
						var navigation_html = '<a class="previous_link" href="javascript:previous();">Prev</a>&nbsp;&nbsp;';
						var current_link = 0;
						while (number_of_pages > current_link) {
							navigation_html += '<a class="page_link" href="javascript:go_to_page(' + current_link + ')" longdesc="' + current_link + '">' + (current_link + 1) + '</a>&nbsp;&nbsp;';
							current_link++;
						}
						navigation_html += '<a class="next_link" href="javascript:next();">Next</a>';

						$('#page_navigation').html(navigation_html);

						//add active_page class to the first page link  
						$('#page_navigation .page_link:first').addClass('active_page');

						//hide all the elements inside content div  
						$('#resultValues').children().css('display', 'none');

						//and show the first n (show_per_page) elements  
						$('#resultValues').children().slice(0, show_per_page).css('display', 'block');
					} else {
						$('#resultValues').append('<h1>' + data.Error + '</h1>');
						$('#page_navigation').hide();
					}
				}
			});
		}
	});
});

//*************************AJAX Call and dynamic data fill for modal window********************
$(document).on("click", "#movieInfo", function(e) {
	console.log("For More Information");
	console.log((($(this).siblings('.panel-heading')).children('.panel-title')).text());
	var title = (($(this).siblings('.panel-heading')).children('.panel-title')).text();
	console.log(title);
	var url2 = 'http://www.omdbapi.com/?t=' + title + '&plot=full&r=json';
	$.ajax({
		type: 'GET',
		url: url2,
		dataType: 'json',
		success: function(data) {
			console.log("On success");
			if (data.Response === "True") {
				if (data.Poster == "N/A") {
					data.Poster = "./../images/default.jpg";
				}
				var movieFullInfo = '<h2><strong>{{Title}}</strong></h2><img src="{{Poster}}"class="thumbnail img-responsive pull-right" id="modalImage" alt="Image not Available"><p><strong>Year:</strong>{{Year}}</p><p><strong>Rated:</strong>{{Rated}}</p><p><strong>Released:</strong>{{Released}}</p><p><strong>Runtime:</strong>{{Runtime}}</p><p><strong>Genre:</strong>{{Genre}}</p><p><strong>Director:</strong>{{Director}}</p><p><strong>Writer:</strong>{{Writer}}</p><p><strong>Actors:</strong>{{Actors}}</p><p><strong>Language:</strong>{{Language}}</p><p><strong>Country:</strong>{{Country}}</p><p><strong>Awards:</strong>{{Awards}}</p><p><strong>Metascore:</strong>{{Metascore}}</p><p><strong>imdbRating:</strong>{{imdbRating}}</p><p><strong>imdbVotes:</strong>{{imdbVotes}}</p><p><strong>imdbID:</strong>{{imdbID}}</p><p><strong>Type:</strong>{{Type}}</p><p><strong>Story:</strong>{{Plot}}</p>';
				$('.modal-body').html(Mustache.render(movieFullInfo, data));

			} else {
				$('.modal-body').append('<h1>' + data.Error + '</h1>');
			}
		}
	});
	$('#myModal').modal();

});


function previous() {

	new_page = parseInt($('#current_page').val()) - 1;
	//if there is an item before the current active link run the function  
	if ($('.active_page').prev('.page_link').length == true) {
		go_to_page(new_page);
	}

}

function next() {
	new_page = parseInt($('#current_page').val()) + 1;
	//if there is an item after the current active link run the function  
	if ($('.active_page').next('.page_link').length == true) {
		go_to_page(new_page);
	}

}

function go_to_page(page_num) {
	//get the number of items shown per page  
	var show_per_page = parseInt($('#show_per_page').val());
	console.log("show_per_page:" + show_per_page);
	//get the element number where to start the slice from
	console.log("page_num " + page_num);
	start_from = page_num * show_per_page;

	//get the element number where to end the slice  
	end_on = start_from + show_per_page;

	//hide all children elements of content div, get specific items and show them  
	$('#resultValues').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');

	/*get the page link that has longdesc attribute of the current page and add active_page class to it 
	and remove that class from previously active page link*/
	$('.page_link[longdesc=' + page_num + ']').addClass('active_page').siblings('.active_page').removeClass('active_page');

	//update the current page input field  
	$('#current_page').val(page_num);
}