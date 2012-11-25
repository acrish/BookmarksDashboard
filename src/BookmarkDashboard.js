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
 */
function createBookmarksDivs(bookmarksWindowId, numOfRows, numOfColumns) {
	var bookmarksWindow = getElement(bookmarksWindowId);
	var bookmarksWindowWidth = parseInt(bookmarksWindow.style.width);
	var bookmarksWindowHeight = parseInt(bookmarksWindow.style.height);
	
	var divMargin = BOOKMARK_MARGIN;
	var divWidth = Math.floor(bookmarksWindowWidth / numOfColumns);
	var divHeight = Math.floor(bookmarksWindowHeight / numOfRows);

	var bookmarkWrappers = new Array(numOfRows);
	for (var i = 0; i < numOfRows; i++) {
		bookmarkWrappers[i] = new Array(numOfColumns);
		var divRow = document.createElement("div");
		for (var j = 0; j < numOfColumns; j++) {
			// Create a wrapper with a bookmark inside.
			bookmarkWrappers[i][j] = new Wrapper(divWidth, divHeight, divMargin, i * numOfColumns + j);
			divRow.appendChild(bookmarkWrappers[i][j].wrapper);
		}
		bookmarksWindow.appendChild(divRow);
	}
	
	// Make wrappers resizable.
	for (var i = 0; i < numOfRows; i++) {
		for (var j = 0; j < numOfRows; j++) {
			$("#" + bookmarkWrappers[i][j].wrapper.id).resizable({ ghost: true, grid: [50, 50] });
		}
	}
}

/**
 * Executes function on page loading.
 */
window.onload = function() {	
	createBookmarksDivs('bookmarksDiv', NUM_OF_ROWS, NUM_OF_COLUMNS);
	var res = supports_html5_storage();
	if (!res)
		alert("I don't support html5 storage! Please update your browser version.");
	//testPersistence();
	addToStore();
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
	var stored = localStorage["noLinks"];
	
	if (!stored) {
		localStorage["noLinks"] = 0;
	}
	alert("No of links = " + localStorage["noLinks"]);
	//alert("Last printed is " + localStorage["last_thumbnail"]);

}

function addToStore() {
	var stored = localStorage["noLinks"];
	
	if (!stored) {
		localStorage["noLinks"] = 0;
	}
	// --- Debugging.... 
	//alert("No of links ==== " + localStorage["noLinks"]);
}

