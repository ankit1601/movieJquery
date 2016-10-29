$(function() {

	//settings for slider
	var width = $('#slider').width();
	var animationSpeed = 500;
	var pause = 3000;
	var currentSlide = 1;

	//cache DOM elements
	var $slider = $('#slider');
	var $slideContainer = $('.slides', $slider);
	var $slides = $('.slide', $slider);

	var interval;

	function startSlider() {
		//console.log("Slider Function Called");
		interval = setInterval(function() {
			$slideContainer.animate({
				'margin-left': '-=' + width
			}, animationSpeed, function() {
				if (++currentSlide === $slides.length) {
					currentSlide = 1;
					$slideContainer.css('margin-left', 0);
				}
			});
		}, pause);
	}

	function pauseSlider() {
		clearInterval(interval);
	}

	$slideContainer
		.on('mouseenter', pauseSlider)
		.on('mouseleave', startSlider);

	startSlider();
	$('#searchResults').hide();

	$('#search').on('click', function(e) {
		var answer = confirm("you searched for " + $('#searchOption').val());
		var title = $('#searchOption').val();
		var urlLink = 'http://www.omdbapi.com/?s=' + title;
		var myData = [];
		var title, poster, type, year;
		if (answer === true) {
			$.ajax({
				type: 'GET',
				url: urlLink,
				dataType: 'json',
				success: function(data) {
						$('#slider').remove();
						$('#resultValues').empty();
						$('#searchResults').show();
					if (data.Response === "True") {
						console.log("in the success: " + data);
						$.each(data, function(value) {
							console.log(value);
							if (value === 'Search') {
								myData = data.Search;
							}
						});
						console.log(myData);
						$.each(myData, function(index) {
							console.log(myData[index]);
							var obj = myData[index];
							title = obj.Title;
							year = obj.Year;
							type = obj.Type;
							if (obj.Poster != "N/A") {
								poster = obj.Poster;
							} else {
								poster = "./../images/default.jpg";
							}
							$('#resultValues').append('<div class="col-lg-4 movie"><div class="panel panel-primary"><div class="panel-heading panelTitleHeight"><h3 class="panel-title">' + title + '</h3></div><img src="' + poster + '" class="img-responsive center-block" style="height:400px" alt="image not Available"/><div class="panel-body">Year: ' + year + '<br>type:' + type + '</div></div></div>');
						});
						$("#movie").Pagination();
					}
					else{
						$('#resultValues').append('<h1>' + data.Error+ '</h1>')
					}
				}
			});
		}
		e.preventDefault();
	});
});

$.fn.Pagination = function (options) {

    var defaults = {
        PagingArea: 'PageList',
        noOfPage: 0,
        curObj: this,
        ParentID: $(this).attr("id"),
        curPage: 1
    };
 }