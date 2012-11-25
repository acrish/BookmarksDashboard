var BOOKMARK_MARGIN = 10; 
var DEFAULT_CLASS_NAME = "BookmarkDiv";

function updateImage(id, url) {
	var noLinks = parseInt(localStorage["noLinks"]);
	if (noLinks && id < noLinks) {
		var name = "tab" + id;
		var info = localStorage[name];
		
		if (info) {
			var obj = JSON.parse(info);
			obj.image = url;
			localStorage[name] = JSON.stringify(obj);
		}
	}
}

var onHoverButtonClick = false; // Workaround for div/button click bug.

/**
 * Defines the bookmark class.
 * @param width the width of the wrapper div
 * @param height the height of the wrapper div
 * @returns the newly created bookmark object
 */
function Bookmark(width, height, id) {	
	// Variables
	var pageLink = "";
	var image = "";
	var category = "";
	
	// Create bookmark div.
	var bookmarkDiv = createBookmarkDiv(width, height, id);
	
	// Create hover div and buttons.
	var hoverButtonsDiv = createHoverDivAndButtons(bookmarkDiv);
	bookmarkDiv.appendChild(hoverButtonsDiv);
	
	// Load bookmarks links;
	var info = localStorage[BkIdGenerator.getId(id)];
	if (info) {
		var obj = JSON.parse(info);
		var bookmarkP = document.createElement("p");
		bookmarkP.style.marginTop = "40px";
		var bookmarkTxt = document.createElement("a");
		bookmarkTxt.style.display="block";
		bookmarkTxt.style.height="100%";
		bookmarkTxt.style.width="100%";
		bookmarkTxt.innerHTML = obj.title;
		bookmarkTxt.href = obj.link;
		bookmarkP.appendChild(bookmarkTxt);
		bookmarkDiv.appendChild(bookmarkP);
		bookmarkDiv.style.backgroundImage = "url('" + obj.image + "')";
		pageLink = obj.link;
	}
	
	bookmarkDiv.addEventListener("click", function() {
		if (!onHoverButtonClick) {
			if (pageLink == "") {
				openNewBookmarkWindow();
			} else {
				// load file
				window.location = pageLink;
			}
		} else {
			onHoverButtonClick = false;
		}

	});

	/**
	 * @return the div for this bookmark
	 */
	this.getDiv = function() {
		return bookmarkDiv;
	};
	
	/**
	 * @param newDiv the new bookmark div
	 */
	this.setDiv = function(newDiv) {
		bookmarkDiv.removeChild(hoverButtonsDiv);
		bookmarkDiv = newDiv;
		hoverButtonsDiv = createHoverDivAndButtons(bookmarkDiv);
		bookmarkDiv.appendChild(hoverButtonsDiv);
	};

	/**
	 * Sets the div dimensions.
	 */
	this.setDimensions = function(newWidth, newHeight) {
		$(bookmarkDiv).width(newWidth - 2 * BOOKMARK_MARGIN);
		$(bookmarkDiv).height(newHeight - 2 * BOOKMARK_MARGIN);
		bookmarkDiv.style.margin = BOOKMARK_MARGIN + "px";
	};
}

/**
 * Creates the bookmark div.
 * @param width the width of the wrapper div
 * @param height the height of the wrapper div
 * @param id the id of the bookmark div
 * @returns the newly created bookmark object
 */
function createBookmarkDiv(width, height, id) {
	var bookmarkDiv = document.createElement("div");
	bookmarkDiv.id = "div" + id;
	
	// Div style.
	$(bookmarkDiv).width(width - 2 * BOOKMARK_MARGIN);
	$(bookmarkDiv).height(height - 2 * BOOKMARK_MARGIN);
	bookmarkDiv.style.margin = BOOKMARK_MARGIN + "px";
	bookmarkDiv.className = DEFAULT_CLASS_NAME + " defaultCategory";
	bookmarkDiv.opacity = 1;
	
	// Drag and drop
	bookmarkDiv.draggable = "true";
	bookmarkDiv.ondragstart = function(event) {
		event.dataTransfer.setData("Text", event.target.id);
		bookmarkDiv.style.opacity = 0.2;
	};
	bookmarkDiv.ondragend = function(event) {
		event.dataTransfer.setData("Text", event.target.id);
		bookmarkDiv.style.opacity = 1;
	};

	return bookmarkDiv;
}

function createHoverDivAndButtons(bookmarkDiv) {
	// Create hover div.
	var hoverButtonsDiv = document.createElement("div");
	hoverButtonsDiv.style.position = "absolute";
	hoverButtonsDiv.style.top = 0;
	hoverButtonsDiv.style.left = 0;
	hoverButtonsDiv.style.display = "none";
	bookmarkDiv.onmouseover = function() {
		hoverButtonsDiv.style.display = "block";
	};
	bookmarkDiv.onmouseout = function() {
		hoverButtonsDiv.style.display = "none";
	};
	
	// Add image button.
	var imageButton = createBookmarkHoverButton("Image", function() {
		onHoverButtonClick = true;
		var url = window.prompt("Enter image url:", "http://");
		if (url != null && url != "") {
			bookmarkDiv.style.backgroundImage = "url('" + url + "')";
			updateImage(id, url);
		}
	});
	hoverButtonsDiv.appendChild(imageButton);
	
	// Add category button.
	var categoryButton= createBookmarkHoverButton("Category", function() {
		onHoverButtonClick = true;
		// Category
		var category = window.prompt('Choose a category from: \n\n* '+ Categories.getAll() + "\n", 
				'default');
		var categoryCssClass = Categories.getCategoryClass(category);
		bookmarkDiv.className = DEFAULT_CLASS_NAME + " " + categoryCssClass;
	});
	hoverButtonsDiv.appendChild(categoryButton);
	
	return hoverButtonsDiv;
}

/**
 * Creates a hover button.
 * @param text the text inside the button // TODO(cmihail): change with image
 * @param onclickFunction the function to be executed on button click
 * @returns the newly created button
 */
function createBookmarkHoverButton(text, onclickFunction) {
	var hoverButton = document.createElement("input");
	hoverButton.type = "button";
	hoverButton.value = text;
	hoverButton.onclick = onclickFunction;
	return hoverButton;
}

function openNewBookmarkWindow() {
	newwindow = window.open('addLinkPopup.html','name','height=200,width=150');
	$("#body").html("<div id='mynewdiv'>hi</div>");
	if (window.focus) {
		newwindow.focus();
	}
}

function bookmarkOnClick(e) {
	alert("Bookmarck clicked!! ");
}
