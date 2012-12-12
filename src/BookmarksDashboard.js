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
	// Get the current page on tab [0 if not found]
	var exists = localStorage["page"];
	var page = 0;

	if (exists)
		page = parseInt(exists);
	else
		localStorage["page"] = 0;

	Categories.load("newCategDiv");
	Categories.populateDialogBox("categories", false);
	
	var nextButton = document.getElementById("page-switcher-next");
	nextButton.onclick = next;
	var prevButton = document.getElementById("page-switcher-prev");
	prevButton.onclick = prev;
	
	createGlobalMenu();
	createBookmarksDivs('bookmarksDiv', NUM_OF_ROWS, NUM_OF_COLUMNS);

	var bgImage = localStorage["bgImage"];
	if (!bgImage) {
		$("html").css("background", '#fff');
	}
	else {
		$("html").css("background-image", 'url(' + bgImage + ')');
		$("html").css("background-repeat", "repeat");
	}
};

/**
 * Creates the global menu.
 */
function createGlobalMenu() {
	// Remove all bookmarks button.
	var removeAllImage = document.getElementById("removeAllImage");
	removeAllImage.onclick=function() {
		if (confirm("Do you really want to remove all your bookmarks?")) {
			var lastId = BkIdGenerator.getSuffix(BkIdGenerator.getNextId());
			for (var i=0; i<lastId; i++) {
				var id = BkIdGenerator.getId(i);
				localStorage.removeItem(id);
			}
			localStorage["page"] = 0;
			window.location.reload();
		}
	};
	removeAllImage.alt="Remove All";
	removeAllImage.title="Remove All Bookmarks";
	removeAllImage.className = "hoverImage";
	
	// Settings button.
	var globalSettings = document.getElementById("globalSettings");
	globalSettings.className = "hoverImage";
	globalSettings.title = "Global settings";
	createSettingsMenu(globalSettings);
}

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
	var displayOrder = getDisplayOrder();
	var ids = getBookmarksIds(numOfRows, numOfColumns, displayOrder);
	var isDraggable = true;
	if (displayOrder.order != "default") {
		isDraggable = false;
	}
 	var bookmarkWrappers = new Array();
 	for (var i = 0, limit = ids.length; i < limit; i++) {
		var wrapper = new Wrapper(divWidth, divHeight, ids[i], 
				{isMockup: false, margin: WRAPPER_MARGIN, draggable: isDraggable,
					localStorageId: BkIdGenerator.getId(ids[i]), wrappers: bookmarkWrappers});
		bookmarkWrappers[wrapper.getId()] = wrapper;
		bookmarksWindow.appendChild(wrapper.getDiv());
 	}

	// Make wrappers resizable.
	if (ids.length > 0) {
		var minWidth = divWidth;
		var minHeight = divHeight;
		var gridWidth = divWidth + 2 * WRAPPER_MARGIN;
		var gridHeight = divHeight + 2 * WRAPPER_MARGIN;
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
	} 
	// Create mockup bookmarks.
	var page = parseInt(localStorage["page"]);
	if (page == 0) {
		//for (var i = ids.length, limit = numOfRows * numOfColumns; i < limit; i++) {
		if (ids.length < numOfRows * numOfColumns) {
			var wrapper = new Wrapper(divWidth, divHeight, (-1) * i, 
					{'isMockup': true, margin: WRAPPER_MARGIN});
			bookmarkWrappers[wrapper.getId()] = wrapper;
			bookmarksWindow.appendChild(wrapper.getDiv());
		}
	}
}


/**
 * @returns the display order
 */
function getDisplayOrder() {
	// Get order from local storage.
	var displayOrder = localStorage["displayOrder"];
	var displayOrderObject;
	if (displayOrder == null) {
		displayOrderObject = {
			order: "default",
		};
		localStorage["displayOrder"] = JSON.stringify(displayOrderObject);
	} else {
		displayOrderObject = JSON.parse(displayOrder);
	}
	
	return displayOrderObject;
}

/**
 * @param numOfRows
 * @param numOfColumns
 * @param displayOrderObject
 * @returns {Array}
 */
function getBookmarksIds(numOfRows, numOfColumns, displayOrder) {
	// Get correct ids from local storage.
	var page = parseInt(localStorage["page"]);
	var ids = new Array();
	
	if (displayOrder.order == "default") { // Default ordering.
		for (var id = page * numOfRows * numOfColumns, limit = (page+1) * numOfRows * numOfColumns;
				localStorage[BkIdGenerator.getId(id)] != null && id < limit; id++) {
			ids.push(id);
		}
	} else if (displayOrder.order == "alphabetical") { // Alphabetical ordering.
		var objects = new Array();
		for (var id = 0; localStorage[BkIdGenerator.getId(id)] != null; id++) {
			var obj = {
					localStorageId: id,
					title: JSON.parse(localStorage[BkIdGenerator.getId(id)]).title
			};
			objects.push(obj);
		}
		
		// Order ids.
		objects.sort(function(a, b) {
			return a.title.localeCompare(b.title);
		});
		// Save ids.
		for (var i = page * numOfRows * numOfColumns, objLimit = objects.length,
				limit = (page + 1) * numOfRows * numOfColumns; i < limit && i < objLimit; i++) {
			ids.push(objects[i].localStorageId);
		}
	} else if (displayOrder.order == "category") {
		var objects = new Array();
		for (var id = 0; localStorage[BkIdGenerator.getId(id)] != null; id++) {
			var obj = {
					localStorageId: id,
					categ: JSON.parse(localStorage[BkIdGenerator.getId(id)]).categ
			};
			objects.push(obj);
		}
		// Order ids.
		objects.sort(function(a, b) {
			return a.categ.localeCompare(b.categ);
		});
		// Save ids.
		for (var i = page * numOfRows * numOfColumns, objLimit = objects.length,
				limit = (page + 1) * numOfRows * numOfColumns; i < limit && i < objLimit; i++) {
			ids.push(objects[i].localStorageId);
		}
	} else {
		alert("There was an internal problem");
	}
	
	return ids;
}

/**
 * @param newWidth
 * @param oldWidth
 */
function calculateRatio(newWidth, oldWidth) {
	var ratio = Math.round(newWidth / oldWidth * 2) / 2;
	return ratio;
}

/**
 * TODO not used anymore, maybe delete
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
