var NUM_OF_ROWS = 3;
var NUM_OF_COLUMNS = 4;
var BOOKMARK_BACKGOUND_COLOR = 'white';
var BOOKMARK_MARGIN = 10; 

function getElement(id) {
	return document.getElementById(id);
}

function createBookmarksDivs(divId, numOfRows, numOfColumns) {
	var bookmarksWindow = getElement(divId);
	var bookmarksWindowWidth = parseInt(bookmarksWindow.style.width);
	var bookmarksWindowHeight = parseInt(bookmarksWindow.style.height);
	
	var divMargin = BOOKMARK_MARGIN;
	var divWidth = Math.floor(bookmarksWindowWidth / numOfColumns - divMargin * 2);
	var divHeight = Math.floor(bookmarksWindowHeight / numOfRows -  divMargin * 2);
//	alert(bookmarksWindowWidth + " " + divHeight + " " + divWidth); TODO
	
	for (var i = 0; i < numOfRows; i++) {
		var divRow = document.createElement("div");
		for (var j = 0; j < numOfColumns; j++) {
			var bookmarkDiv = document.createElement("div");
			bookmarkDiv.style.width = divWidth + "px";
			bookmarkDiv.style.height = divHeight + "px";
			bookmarkDiv.style.background = 'white';
			bookmarkDiv.style.float = "left";
			bookmarkDiv.style.margin = divMargin + "px"; // TODO
			divRow.appendChild(bookmarkDiv);
			
			// TODO dev only
			var txt = document.createTextNode("TODO " + i + " " + j);
			bookmarkDiv.appendChild(txt); 
		}
		bookmarksWindow.appendChild(divRow);
	}
}

window.onload = function() {
	createBookmarksDivs('bookmarksDiv', NUM_OF_ROWS, NUM_OF_COLUMNS);
};