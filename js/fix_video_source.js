$(function() {

	var url = getFullPath();

	$("source").each(function() {
		var source = $(this);
		var src = source.attr("src");

		source.attr("src", url+src);
	});

});

function getFullPath() {
	var url = window.location.href.toString();
	var parts = url.split("/");
	var lenght = parts.length;

	var result = "";
	for (var i = 0; i < lenght-1; i++) {
		result += parts[i] + "/";
	}

	return result;
}