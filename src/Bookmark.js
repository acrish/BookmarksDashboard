var BOOKMARK_MARGIN = 10; 

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

/**
 * Defines the bookmark class.
 * @param width the width of the wrapper div
 * @param height the height of the wrapper div
 * @returns the newly created bookmark object
 */
function Bookmark(width, height, id) {	
	var margin = BOOKMARK_MARGIN;
	// Variables
	var pageLink = "";
	var image = "";
	var category = "";
	
	// Create bookmark div.
	var bookmarkDiv = createBookmarkDiv(id);
	$(bookmarkDiv).width(width - 2 * margin);
	$(bookmarkDiv).height(height - 2 * margin);
	bookmarkDiv.style.margin = margin + "px";
	
	// Create hover div.
	var hoverButtonsDiv = document.createElement("div");
	hoverButtonsDiv.style.position = "absolute";
	hoverButtonsDiv.style.top = 0;
	hoverButtonsDiv.style.left = 0;
	hoverButtonsDiv.style.display = "none";
	bookmarkDiv.appendChild(hoverButtonsDiv);
	bookmarkDiv.onmouseover = function() {
		hoverButtonsDiv.style.display = "block";
	};
	bookmarkDiv.onmouseout = function() {
		hoverButtonsDiv.style.display = "none";
	};
	
	// Workaround for div/button click bug.
	var onHoverButtonClick = false; 
	
	// Add change bookmark button.
	var bookmarkButton = createBookmarkHoverButton("Bookmark", function() {
		onHoverButtonClick = true;
		openNewBookmarkWindow();
	});
	hoverButtonsDiv.appendChild(bookmarkButton);
	
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
		bookmarkDiv.className = categoryCssClass;
	});
	hoverButtonsDiv.appendChild(categoryButton);
	
	// Load bookmarks links;
	//localStorage.clear();
	var noLinks = parseInt(localStorage["noLinks"]);
	if (noLinks && id < noLinks) {
		//alert("intra");
		var name = "tab" + id;
		var info = localStorage[name];
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
	 * Sets the div dimensions.
	 */
	this.setDimensions = function(newWidth, newHeight) {
		$(bookmarkDiv).width(newWidth - 2 * margin);
		$(bookmarkDiv).height(newHeight - 2 * margin);
		bookmarkDiv.style.margin = margin + "px";
	};
}

/**
 * Creates the bookmark div.
 * @param id the id of the bookmark div
 * @returns the newly created bookmark object
 */
function createBookmarkDiv(id) {
	var bookmarkDiv = document.createElement("div");
	bookmarkDiv.id = "div" + id;
	bookmarkDiv.className = "defaultCategory";
	
	// Div style.
	bookmarkDiv.style.background = "grey";
	bookmarkDiv.style.float = "left";
	bookmarkDiv.style.position = "relative";
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
