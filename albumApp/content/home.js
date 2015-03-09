$( function (){
	var tmpl,
	// Main template HTML
	tdata = {}; // JSON data object that feeds the template
	
	// Initialize page
	var initPage = function () {

		// Load the HTML template
	$.get("/templates/home.html", function(d){
		tmpl = d;
	});
	// Retrieve the server data and then initialize the page
	$.getJSON("/albums.json", function (d) {
        console.log("d.data: " + JSON.stringify(d));
		//$.extend(tdata, JSON.stringify(d));
        tdata = d;
        console.log("tdata: " + JSON.stringify(tdata));
	});

	// When AJAX calls are complete parse the template
	// replacing mustache tags with vars
	$(document).ajaxStop(function () {
		var renderedPage = Mustache.render(tmpl, tdata);
		$('body').html(renderedPage);
	})
	}();
});