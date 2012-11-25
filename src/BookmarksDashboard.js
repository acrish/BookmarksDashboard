var NUM_OF_ROWS = 3;
var NUM_OF_COLUMNS = 4;

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
	
	var divWidth = Math.floor(bookmarksWindowWidth / numOfColumns);
	var divHeight = Math.floor(bookmarksWindowHeight / numOfRows);

	// Create wrappers and bookmarks.
	var bookmarkWrappers = new Array();
	for (var i = 0; i < numOfRows * numOfColumns; i++) {
		// Create a wrapper with a bookmark inside.
		var wrapper = new Wrapper(divWidth, divHeight, i, bookmarkWrappers);
		bookmarkWrappers[wrapper.getId()] = wrapper;
		bookmarksWindow.appendChild(wrapper.getDiv());
	}
	
	// Make wrappers resizable.
	var minWidth = divWidth / 2; // Same with grid width.
	var minHeight = divHeight / 2; // Same with grid height.
	var maxWidth = divWidth * 2;
	var maxHeight = divHeight;
	for (var wrapper in bookmarkWrappers) {
		$("#" + wrapper).resizable({
			ghost: true,
			grid: [minWidth, minHeight],
			minWidth: minWidth,
			minHeight: minHeight,
			maxWidth: maxWidth,
			maxHeight: maxHeight,
			stop: function(event, ui) {
				bookmarkWrappers[ui.originalElement[0].id].resizeBookmark($(event.target).width(),
						$(event.target).height());
			}
		});
	}
}

/**
 * Executes function on page loading.
 */
window.onload = function() {
	var res = supports_html5_storage();
	if (!res)
		alert("I don't support html5 storage! Please update your browser version.");
	//testPersistence();
	
	var removeAllImage = document.getElementById("removeAllImage");
	removeAllImage.onclick=function() {
		localStorage.clear();
		window.reload();
	};
	removeAllImage.alt="Remove All";
	
	createBookmarksDivs('bookmarksDiv', NUM_OF_ROWS, NUM_OF_COLUMNS);
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

function addToStore() {
	var stored = localStorage["noLinks"];
	
	if (!stored) {
		localStorage["noLinks"] = 0;
	}
	// --- Debugging.... 
	//alert("No of links ==== " + localStorage["noLinks"]);
}

