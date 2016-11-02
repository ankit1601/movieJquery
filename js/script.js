$(function() {
	$('#searchResults').hide();
	// ****************AJAX call and code for search of movie with title and displaying the results**************
	$('#searchBarMargin').on('submit', function(e) {
		e.preventDefault();
		var searchValue = $('#searchOption').val();
		var urlLink = 'http://www.omdbapi.com/?s=' + searchValue;
		var myData = [];
			$.ajax({
				type: 'GET',
				url: urlLink,
				dataType: 'json',
				success: function(data) {
					$('#myCarousel').hide();//hiding the carousel window after 
					$('#resultValues').empty();//removing the 
					
					if (data.Response === "True") {
						$.each(data, function(value) {
							if (value === 'Search') {
								myData = data.Search;
							}
						});
						$.each(myData, function(index) {
							var obj = myData[index];
							if (obj.Poster == "N/A") {
								obj.Poster = "./../images/default.jpg";
							}
							var movieTemplate = '<div class="col-lg-4 col-md-6 col-sm-6 movie"><div class="panel panel-primary"><div class="panel-heading panelTitleHeight"><h3 class="panel-title">{{Title}}</h3></div><img src="{{Poster}}" class="img-responsive center-block" style="height:400px" alt="image not Available"/><div class="panel-body"><div>Year:{{Year}}</div><br><div id="type">type:{{Type}}</div></div><button class="btn btn-info btn-block" type="button" id="movieInfo">Click Here More Information</button></div></div>';
							//$('#resultValues').append('<div class="col-lg-4 movie"><div class="panel panel-primary"><div class="panel-heading panelTitleHeight"><h3 class="panel-title">' + title + '</h3></div><img src="' + poster + '" class="img-responsive center-block" style="height:400px" alt="image not Available"/><div class="panel-body">Year: ' + year + '<br>type:' + type + '</div></div></div>');
							$('#resultValues').append(Mustache.render(movieTemplate, obj));
						});
						$('#searchResults').slideDown();
						//how much items per page to show  
						var show_per_page = 3;
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
						$('#page_navigation .page_link:first').addClass('active');

						//hide all the elements inside content div  
						$('#resultValues').children().css('display', 'none');

						//and show the first n (show_per_page) elements  
						$('#resultValues').children().slice(0, show_per_page).css('display', 'block');
					} else {
						$('#resultValues').append('<h1>' + data.Error + 'Please search again</h1>');
						$('#searchResults').slideDown();
						$('#page_navigation').hide();
					}
				},
				error:function(){
					$('#myCarousel').hide();//hiding the carousel window after 
					$('#resultValues').empty();//removing the 
					$('#searchResults').show(); 
					$('#resultValues').append('<h1>Network Error please check your internet connection</h1>');
				}
			});
	});
});

//*************************AJAX Call and dynamic data fill for modal window********************
$(document).on("click", "#movieInfo", function(e) {
	var title = (($(this).siblings('.panel-heading')).children('.panel-title')).text();
	var typeArray =	(($(this).siblings('.panel-body')).children('#type')).text().split(':');
	var type = typeArray[typeArray.length-1];
	console.log("type:"+type);
	var url2 = 'http://www.omdbapi.com/?t=' + title + '&plot=full&r=json&type='+type;
	$.ajax({
		type: 'GET',
		url: url2,
		dataType: 'json',
		success: function(data) {
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
	if ($('.active').prev('.page_link').length == true) {
		go_to_page(new_page);
	}

}

function next() {
	new_page = parseInt($('#current_page').val()) + 1;
	//if there is an item after the current active link run the function  
	if ($('.active').next('.page_link').length == true) {
		go_to_page(new_page);
	}

}

function go_to_page(page_num) {
	//get the number of items shown per page  
	var show_per_page = parseInt($('#show_per_page').val());
	//get the element number where to start the slice from
	start_from = page_num * show_per_page;
	//get the element number where to end the slice  
	end_on = start_from + show_per_page;

	//hide all children elements of content div, get specific items and show them  
	$('#resultValues').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');

	/*get the page link that has longdesc attribute of the current page and add active_page class to it 
	and remove that class from previously active page link*/
	$('.page_link[longdesc=' + page_num + ']').addClass('active').siblings('.active').removeClass('active');

	//update the current page input field  
	$('#current_page').val(page_num);
}