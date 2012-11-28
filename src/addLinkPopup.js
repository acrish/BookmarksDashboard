function getLink() {
	chrome.tabs.getSelected(null, function(tab) {
		document.getElementById("tabUrl").value = tab.url;
		document.getElementById("tabTitle").value = tab.title;
	});
}

function addBookmark() {	
	// Adding bookmark
	var url = document.getElementById("tabUrl").value;
	var descr = document.getElementById("tabTitle").value;
	var select = document.getElementById("categ");
	var category = select.options[select.selectedIndex].value;
	var name = BkIdGenerator.getNextId();
	var thingy = {};
	
	thingy.link = url;
	thingy.title = descr;
	thingy.categ = category;
	thingy.image = "";
	thingy.widthRatio = 1;
	thingy.heightRatio = 1;
	localStorage[name] = JSON.stringify(thingy);

	// Refresh all new tab pages to show the new bookmark.
	var views = chrome.extension.getViews();
	for (var i in views) {
		var location = views[i].location;
		location.reload();
	}
	
	window.close();
}

function closePopup() {
	window.close();
}
document.addEventListener('DOMContentLoaded', function() {
	var bts = document.querySelectorAll('button');
	if (bts.length == 2) {
		bts[0].addEventListener('click', addBookmark);
		bts[1].addEventListener('click', closePopup);
	}
});
getLink();