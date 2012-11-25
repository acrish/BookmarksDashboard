//alert("intra pe aici--------??");
function getLink() {
	// alert("intra pe aici??");
	chrome.tabs.getSelected(null, function(tab) {
		document.getElementById("tabUrl").value = tab.url;
		document.getElementById("tabTitle").value = tab.title;
	});
}

function addBookmark() {
	// Adding bookmark
	var url = document.getElementById("tabUrl").value;
	var category = document.getElementById("category").value;
	var descr = document.getElementById("tabTitle").value;
	if (category == "")
		category = "Default";

	var name = BkIdGenerator.getNextId();
	var thingy = {};
	thingy.link = url;
	thingy.title = descr;
	thingy.categ = category;
	thingy.image = "";
	localStorage[name] = JSON.stringify(thingy);

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