var NUM_OF_ROWS = 3;
var NUM_OF_COLUMNS = 4;
var WRAPPER_MARGIN = 10;

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
		if (confirm("Do you really want to remove all your bookmarks?")) {
			localStorage.clear();
			window.location.reload();
		}
	};
	removeAllImage.alt="Remove All";
	removeAllImage.className = "hoverImage";
	removeAllImage.style.marginLeft = "15px";
	
	createBookmarksDivs('bookmarksDiv', NUM_OF_ROWS, NUM_OF_COLUMNS);
};

/**
 * @param bookmarksWindowId the id of the div that contains the bookmarks
 * @param numOfRows the number of rows
 * @param numOfColumns the number of columns
 */
function createBookmarksDivs(bookmarksWindowId, numOfRows, numOfColumns) {
	var bookmarksWindow = document.getElementById(bookmarksWindowId);
	var bookmarksWindowWidth = parseInt(bookmarksWindow.style.width);
	var bookmarksWindowHeight = parseInt(bookmarksWindow.style.height);
	bookmarksWindowWidth -= bookmarksWindowWidth / 10; // Necessary for css styling.
	bookmarksWindowHeight -= bookmarksWindowHeight / 10;
	
	var divWidth = Math.floor(bookmarksWindowWidth / numOfColumns);
	var divHeight = Math.floor(bookmarksWindowHeight / numOfRows);

	// Create wrappers and bookmarks.
	var bookmarkWrappers = new Array();
	var id = 0;
	var limit = numOfRows * numOfColumns;
	for (; localStorage[BkIdGenerator.getId(id)] != null && id < limit; id++) {
		var wrapper = new Wrapper(divWidth, divHeight, id,
				{'isMockup': false, 'localStorageId': BkIdGenerator.getId(id), 'wrappers': bookmarkWrappers});
		bookmarkWrappers[wrapper.getId()] = wrapper;
		bookmarksWindow.appendChild(wrapper.getDiv());
	}
	
	// Make wrappers resizable.
	if (id > 0) {
		var minWidth = divWidth / 2 - WRAPPER_MARGIN;
		var minHeight = divHeight / 2 - WRAPPER_MARGIN;
		var gridWidth = divWidth / 2 + WRAPPER_MARGIN;
		var gridHeight = divHeight / 2 + WRAPPER_MARGIN;
		var maxWidth = (divWidth + WRAPPER_MARGIN) * 2;
		var maxHeight = (divHeight + WRAPPER_MARGIN) * 2;
		for (var wrapper in bookmarkWrappers) {
			$("#" + wrapper).resizable({
				ghost: true,
				grid: [gridWidth, gridHeight],
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
		
		// Create mockup bookmarks.
		for (; id < limit; id++) {
			var wrapper = new Wrapper(divWidth, divHeight, id, {'isMockup': true});
			bookmarkWrappers[wrapper.getId()] = wrapper;
			bookmarksWindow.appendChild(wrapper.getDiv());
		}
	} else { // Hint message.
		printHintMessage(bookmarksWindow);
		document.getElementById("settingsMenu").style.display = "none";
	}
}

function printHintMessage(bookmarksWindow) {
	bookmarksWindow.style.width = "100%";
	width = $(bookmarksWindow).width() / 3;
	var message = document.createElement("p");
	message.id = "hintMessage";
	message.innerHTML = "When you are on a page you want to save, click on " +
			"<img src='images/lightbulb.png' class='hintImage' />" +
			" to add it to bookmarks " +
			"<img width='" + width + "' src='images/green_arrow.jpg' class='hintImage' />";
	bookmarksWindow.appendChild(message);
}

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

