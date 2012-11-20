var NUM_OF_ROWS = 3;
var NUM_OF_COLUMNS = 4;
var BOOKMARK_MARGIN = 10; 

/**
 * Gets an element by its id.
 * @param id the id of the element
 * @returns the object
 */
function getElement(id) {
	return document.getElementById(id);
}

/**
 * @param bookmarksWindowId the id of the div that contains the bookmarks
 * @param numOfRows the number of rows
 * @param numOfColumns the number of columns
 * @return a vector with all bookmarks divs
 */
function createBookmarksDivs(bookmarksWindowId, numOfRows, numOfColumns) {
	var bookmarksWindow = getElement(bookmarksWindowId);
	var bookmarksWindowWidth = parseInt(bookmarksWindow.style.width);
	var bookmarksWindowHeight = parseInt(bookmarksWindow.style.height);
	
	var divMargin = BOOKMARK_MARGIN;
	var divWidth = Math.floor(bookmarksWindowWidth / numOfColumns - divMargin * 2);
	var divHeight = Math.floor(bookmarksWindowHeight / numOfRows -  divMargin * 2);

	var bookmarks = new Array(numOfRows);
	for (var i = 0; i < numOfRows; i++) {
		bookmarks[i] = new Array(numOfColumns);
		var divRow = document.createElement("div");
		for (var j = 0; j < numOfColumns; j++) {
			bookmarks[i][j] = new Bookmark(divWidth, divHeight, divMargin, i * numOfColumns + j);
			
			// Wrap the div so that dropping occurs in a specific area
			var divWrapper = document.createElement("div");
			divWrapper.id = "wrapper" + (i * numOfColumns + j);
			divWrapper.style.width = (divWidth  + divMargin * 2) + "px";
			divWrapper.style.height = (divHeight + divMargin * 2) + "px";
			divWrapper.style.background = "grey";
			divWrapper.style.float = "left";
			divWrapper.appendChild(bookmarks[i][j].getDiv());
			
			// Drag and drop event handler
			divWrapper.ondrop = function(event) {
				// Exchange div from source wrapper with div from destination wrapper
				event.preventDefault();
				var data = event.dataTransfer.getData("Text");
				var dstDiv = event.target;
				var srcDiv = document.getElementById(data);
				var srcWrapper = srcDiv.parentNode;
				var dstWrapper = dstDiv.parentNode;
				dstWrapper.removeChild(dstDiv);
				dstWrapper.appendChild(srcDiv);
				srcWrapper.appendChild(dstDiv);
				srcDiv.style.opacity = 1;
			};
			divWrapper.ondragover = function(event) {
				event.preventDefault();
			};
			
			divRow.appendChild(divWrapper);
		}
		bookmarksWindow.appendChild(divRow);
	}
	
	return bookmarks;
}

/**
 * Executes function on page loading.
 */
window.onload = function() {
	var bookmarks = createBookmarksDivs('bookmarksDiv', NUM_OF_ROWS, NUM_OF_COLUMNS);
	var res = supports_html5_storage();
	if (!res)
		alert("I don't support html5 storage! Please update your browser version.");
	//testPersistence();	
};

/**
 * @returns {Boolean} true if browser supports html5 storage
 */
function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

// Test persistence:
function testPersistence() {
	var stored = localStorage["last_thumbnail"];
	
	if (!stored) {
		localStorage["last_thumbnail"] = "works!";
		alert("Now added sth to local storage");
	}
	alert("Last printed is " + localStorage["last_thumbnail"]);

}

