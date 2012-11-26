var DEFAULT_CLASS_NAME = "BookmarkDiv";

var onHoverButtonClick = false; // Workaround for div/button click bug.

/**
 * Defines the bookmark class.
 * @param width the width of the wrapper div
 * @param height the height of the wrapper div
 * @param options the options for creating a bookmark
 * @returns the newly created bookmark object
 */
function Bookmark(width, height, id, options) {	
	// Variables
	var pageLink = "";
	
	// Create bookmark div.
	var bookmarkDiv = createBookmarkDiv(width, height, id);
	
	// Add content to bookmark div.
	var hoverButtonsDiv = null;
	var bookmarkParagraph = document.createElement("p");
	if (!options['isMockup']) { // Load bookmark link.
		var info = localStorage[options['localStorageId']];
		if (info == null) {
			alert("There was an internal problem");
		}
		hoverButtonsDiv = createHoverDivAndIcons(bookmarkDiv, id);
		bookmarkDiv.appendChild(hoverButtonsDiv);
		
		var obj = JSON.parse(info);
		bookmarkDiv.style.backgroundImage = "url('" + obj.image + "')";
		pageLink = obj.link;
		
		var bookmarkParagraph = document.createElement("p");
		var bookmarkTxt = document.createElement("a");
		bookmarkTxt.innerHTML = obj.title;
		bookmarkTxt.href = pageLink;
		bookmarkParagraph.appendChild(bookmarkTxt);
		
		bookmarkDiv.addEventListener("click", function() {
			if (!onHoverButtonClick) {
				window.location = pageLink;
			} else {
				onHoverButtonClick = false;
			}
		});
		
	} else { // Add a mockup text.
		bookmarkParagraph.innerHTML = "When you are on a page you want to save, click on " +
			"<img src='images/lightbulb.png' class='hintImage' />" +
			" to add it to bookmarks ";
	}
	bookmarkDiv.appendChild(bookmarkParagraph);

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
		hoverButtonsDiv = createHoverDivAndIcons(bookmarkDiv, id);
		bookmarkDiv.appendChild(hoverButtonsDiv);
	};

	/**
	 * Sets the div dimensions.
	 */
	this.setDimensions = function(newWidth, newHeight) {
		$(bookmarkDiv).width(newWidth);
		$(bookmarkDiv).height(newHeight);
	};
}

/**
 * @param id
 * @param url
 */
function updateImage(id, url) {
	name = BkIdGenerator.getId(id);
	
	var info = localStorage[name];
	
	if (info) {
		var obj = JSON.parse(info);
		obj.image = url;
		localStorage[name] = JSON.stringify(obj);
	}
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
	bookmarkDiv.id = BkIdGenerator.getId(id);
	
	// Div style.
	$(bookmarkDiv).width(width);
	$(bookmarkDiv).height(height);
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

/**
 * @param bookmarkDiv the bookmark div
 * @returns the newly created hover div
 */
function createHoverDivAndIcons(bookmarkDiv, id) {
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
	var imageButton = createBookmarkHoverImage("images/IPhoto_Icon.png", "Image", function() {
		onHoverButtonClick = true;
		var url = window.prompt("Enter image url:", "http://");
		if (url != null && url != "") {
			bookmarkDiv.style.backgroundImage = "url('" + url + "')";
			updateImage(id, url);
		}
	});
	hoverButtonsDiv.appendChild(imageButton);
	
	// Add category button.
	var categoryButton= createBookmarkHoverImage("images/category.png", "Category", function() {
		onHoverButtonClick = true;
		// Category
		var category = window.prompt('Choose a category from: \n\n* '+ Categories.getAll() + "\n", 
				'default');
		var categoryCssClass = Categories.getCategoryClass(category);
		bookmarkDiv.className = DEFAULT_CLASS_NAME + " " + categoryCssClass;
	});
	hoverButtonsDiv.appendChild(categoryButton);
	
	// Add remove button
	var removeButton = createBookmarkHoverImage("images/Recycle_Bin_f.png", "Remove", 
			function() {
		onHoverButtonClick = true;
		// Confirm removal
		var bkId = this.parentNode.parentNode.id;
		if (confirm("Really want to remove " + bkId + "?") && localStorage[bkId]) {
			var prevId = bkId;
			var i = BkIdGenerator.getSuffix(prevId) + 1;
			var currId = BkIdGenerator.getId(i);
			
			while (localStorage[currId]) {
				localStorage[prevId] =	localStorage[currId];
				prevId = currId;
				i++;
				currId = BkIdGenerator.getId(i);
				
				// Added for prev & next buttons
				var noLinks = BkIdGenerator.getSuffix(currId);
				var page = parseInt(localStorage["page"]);
					
				if (noLinks / (MAXIMUM_PAGE_LINKS + 1) != page) {
					page--;
					localStorage["page"] = page;
				}
			}
			localStorage.removeItem(prevId); 
			window.location.reload(true);
		}
		
	});
	hoverButtonsDiv.appendChild(removeButton);
	
	return hoverButtonsDiv;
}

/**
 * Creates a hover button.
 * @param text the text inside the button // TODO(cmihail): change with image
 * @param onclickFunction the function to be executed on button click
 * @returns the newly created button
 */
function createBookmarkHoverImage(src, text, onclickFunction) {
	var hoverImage = document.createElement("img");
	hoverImage.alt = text;
	hoverImage.src = src;
	hoverImage.onclick = onclickFunction;	
	hoverImage.className = "hoverImage"; 
	hoverImage.onmouseover = function() {
		this.style.border = "1px solid black";
	};
	hoverImage.onmouseout = function() {
		this.style.border = "0";
	};
	
	
	return hoverImage;
}
