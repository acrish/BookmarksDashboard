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
	// Get the current page on tab [0 if not found]
	var exists = localStorage["page"];
	var page = 0;

	if (exists)
		page = parseInt(exists);
	else
		localStorage["page"] = 0;
		
	var removeAllImage = document.getElementById("removeAllImage");
	removeAllImage.onclick=function() {
		if (confirm("Do you really want to remove all your bookmarks?")) {
			localStorage.clear();
			localStorage["page"] = 0;
			window.location.reload();
		}
	};
	removeAllImage.alt="Remove All";
	removeAllImage.title="Remove All Bookmarks";
	removeAllImage.className = "hoverImage";
	removeAllImage.style.marginLeft = "15px";
	
	Categories.populateDialogBox();

	var nextButton = document.getElementById("page-switcher-next");
	nextButton.onclick = next;
	var prevButton = document.getElementById("page-switcher-prev");
	prevButton.onclick = prev;
	
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
	bookmarksWindowHeight -= bookmarksWindowHeight / 10; // TODO maybe padding instead
	
	var divWidth = Math.floor(bookmarksWindowWidth / numOfColumns);
	var divHeight = Math.floor(bookmarksWindowHeight / numOfRows);

	// Create wrappers and bookmarks.
	var bookmarkWrappers = new Array();
	//var id = 0;
	// Id starts from current_page * numOfRows * numOfColumns 
	var page = parseInt(localStorage["page"]);
	var id = page * numOfRows * numOfColumns;
	var limit = (page+1) * numOfRows * numOfColumns;
	for (; localStorage[BkIdGenerator.getId(id)] != null && id < limit; id++) {
		var wrapper = new Wrapper(divWidth, divHeight, id, 
				{'isMockup': false, margin: WRAPPER_MARGIN,
					'localStorageId': BkIdGenerator.getId(id),  'wrappers': bookmarkWrappers});
		bookmarkWrappers[wrapper.getId()] = wrapper;
		bookmarksWindow.appendChild(wrapper.getDiv());
	}
	//alert("after");
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
					var widthRatio = calculateRatio($(event.target).width(), divWidth);
					var heightRatio = calculateRatio($(event.target).height(), divHeight);
					bookmarkWrappers[ui.originalElement[0].id].resize(widthRatio, heightRatio);
				}
			});
		}
		
		// Create mockup bookmarks.
		if (page == 0) {
			for (; id < limit; id++) {
				var wrapper = new Wrapper(divWidth, divHeight, id,
						{'isMockup': true, margin: WRAPPER_MARGIN});
				bookmarkWrappers[wrapper.getId()] = wrapper;
				bookmarksWindow.appendChild(wrapper.getDiv());
			}
		}
	} else { // Hint message.
		printHintMessage(bookmarksWindow);
		document.getElementById("settingsMenu").style.display = "none";
	}
}

/**
 * @param newWidth
 * @param oldWidth
 */
function calculateRatio(newWidth, oldWidth) {
	var ratio = Math.floor(newWidth / oldWidth * 10) / 10;
	if (ratio < 1) {
		ratio += 0.1;
	}
	return ratio;
}

/**
 * @param bookmarksWindow
 */
function printHintMessage(bookmarksWindow) {
	bookmarksWindow.style.width = "100%";
	width = $(bookmarksWindow).width() / 3;
	var message = document.createElement("p");
	message.id = "hintMessage";
	message.innerHTML = "Click on " +
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

/**
 *  Test persistence.
 */
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

function next() {
	// The variable is stored on load
	var page = parseInt(localStorage["page"]);
	var noLinks = BkIdGenerator.getSuffix(BkIdGenerator.getNextId());
	var maximumLinks = NUM_OF_ROWS * NUM_OF_COLUMNS;
	var maxPages = Math.floor(noLinks / maximumLinks);

	if (noLinks % maximumLinks != 0)
		maxPages++;
	if (noLinks == 0 || page + 1 == maxPages)
		return;
	page ++;
	localStorage["page"] = page;
	window.location.reload();
}

function prev() {
	// The variable is stored on load
	var page = parseInt(localStorage["page"]);
	var noLinks = BkIdGenerator.getSuffix(BkIdGenerator.getNextId());
	//alert(page);
	if (page == 0)
		return;
	page --;
	localStorage["page"] = page;
	window.location.reload();
}
