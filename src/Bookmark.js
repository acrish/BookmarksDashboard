var DEFAULT_CLASS_NAME = "BookmarkDiv";
var MAXIMUM_PAGE_LINKS = 12;
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
		
		// Hover buttons.
		hoverButtonsDiv = createHoverDivAndIcons(bookmarkDiv, id);
		bookmarkDiv.appendChild(hoverButtonsDiv);
		
		// Inside link.
		var obj = JSON.parse(info);
		bookmarkDiv.style.backgroundImage = "url('" + obj.image + "')";
		pageLink = obj.link;
		
		var bookmarkParagraph = document.createElement("p");
		bookmarkParagraph.style.marginTop = "20%";
		
		var bookmarkTxt = document.createElement("a");
		bookmarkTxt.innerHTML = obj.title;
		bookmarkTxt.href = pageLink;
		bookmarkTxt.style.fontSize = "18px";
		bookmarkTxt.style.textDecoration = "none";
		bookmarkTxt.style.color = "white";
		bookmarkTxt.style.textShadow=" 0px 0px 25px black , 0px 0px 20px black , 0px 0px 15px black, 0px 0px 10px black, 0px 0px 5px black, 0px 0px 5px black";
		bookmarkParagraph.appendChild(bookmarkTxt);
		
		// Category.
		var categoryCssClass = Categories.getCategoryClass(obj.categ);
		bookmarkDiv.className = DEFAULT_CLASS_NAME + " " + categoryCssClass;
		
		// Open bookmark.
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
		bookmarkParagraph.style.marginTop = "20%";
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
		$("#overlay").show();
		$("#categories_dialog").fadeIn(300);
        $("#overlay").unbind("click");
		$("#btnClose").click(function (e) {
		     HideDialog();
		     e.preventDefault();
		  });
		// Prevent triggering click events for past binded objects and bind the current one.
		$("#btnSubmit").unbind("click");
		$("#btnSubmit").click(function (e) {
			var categ = $("#categories input:radio:checked").val();
			categoryCssClass = Categories.getCategoryClass(categ);
			bookmarkDiv.className = DEFAULT_CLASS_NAME + " " + categoryCssClass;
			HideDialog();
			e.preventDefault();			
			updateCategory(id, categ);
		});
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
			}
			localStorage.removeItem(prevId); 
			
			// Added for prev & next buttons
			i--;
			var page = parseInt(localStorage["page"]);			
			if (Math.floor(i / (MAXIMUM_PAGE_LINKS+1)) != page) {
				page--;
				localStorage["page"] = page;
			}
			window.location.reload(true);
		}
		
	});
	hoverButtonsDiv.appendChild(removeButton);
	
	/*	// Add settings button.
	var settingsIcon= createBookmarkHoverImage("images/setting.png", "Settings", function() {
		onHoverButtonClick = true;
		// Load settings dialog
		window.open("editSingleBookmark.html");
		//TODO make the settings persistent
		});
	hoverButtonsDiv.appendChild(settingsIcon);
	*/
	return hoverButtonsDiv;
}

/**
 * Called to close the dialog popup window.
 */
function HideDialog() {
   $("#overlay").hide();
   $("#categories_dialog").fadeOut(300);
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
 * @param id
 * @param category
 */
function updateCategory(id, category) {
	name = BkIdGenerator.getId(id);
	var info = localStorage[name];
	if (info) {
		var obj = JSON.parse(info);
		obj.categ = category;
		localStorage[name] = JSON.stringify(obj);
	}
}

/**
 * Creates a hover button.
 * @param text tooltip on icon
 * @param onclickFunction the function to be executed on button click
 * @returns the newly created button
 */
function createBookmarkHoverImage(src, text, onclickFunction) {
	var hoverImage = document.createElement("img");
	hoverImage.alt = text;
	hoverImage.title = text;
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
