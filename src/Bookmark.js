/**
 * Defines the bookmark class.
 * @param width the width of the bookmark div
 * @param height the height of the bookmark div
 * @param margin the margin of the bookmark div
 * @returns the newly created bookmark object
 */
function Bookmark(width, height, margin, id) {
	// Create bookmark div.
	var bookmarkDiv = createBookmarkDiv(width, height, margin, id);
	
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
	
	// TODO(cmihail): dev only, delete it
	var bookmarkImage = document.createElement("p");
	bookmarkImage.innerHTML = "Bookmark: " + id;
	bookmarkImage.style.marginTop = "40px";
	bookmarkDiv.appendChild(bookmarkImage); 
	
	// Add image button.
	var imageButton = createBookmarkHoverButton("Add Image", function() {
		var url = window.prompt("Enter image url:", "http://");
		if (url != null && url != "") {
			if (bookmarkImage != null) {
				bookmarkDiv.removeChild(bookmarkImage);
				bookmarkImage = null;
			}
			bookmarkDiv.style.backgroundImage = "url('" + url + "')";
		}
	});
	hoverButtonsDiv.appendChild(imageButton);
	
	// Add category button.
	var categoryButton= createBookmarkHoverButton("Add category", function() {
		// Category
		var category = window.prompt('Choose a category from: \n\n* '+ Categories.getAll() + "\n", 
				'default');
		var categoryCssClass = Categories.getCategoryClass(category);
		bookmarkDiv.className = categoryCssClass;
	});
	hoverButtonsDiv.appendChild(categoryButton);
	
	/**
	 * @return the div for this bookmark
	 */
	this.getDiv = function() {
		return bookmarkDiv;
	};
}

/**
 * Creates the bookmark div.
 * @param width the width of the bookmark div
 * @param height the height of the bookmark div
 * @param margin the margin of the bookmark div
 * @returns the newly created bookmark object
 */
function createBookmarkDiv(width, height, margin, id) {
	var bookmarkDiv = document.createElement("div");
	bookmarkDiv.id = "div"+id;
	bookmarkDiv.className = "defaultCategory";
	
	// Div style.
	bookmarkDiv.style.width = (width - 2 * margin) + "px";
	bookmarkDiv.style.height = (height - 2 * margin) + "px";
	bookmarkDiv.style.margin = margin + "px";
	bookmarkDiv.style.background = "white";
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
