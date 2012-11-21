/**
 * Defines the bookmark class.
 * @param width the width of the bookmark div
 * @param height the height of the bookmark div
 * @param margin the margin of the bookmark div
 * @returns the newly created bookmark object
 */
function Bookmark(width, height, margin, id) {
	// Create bookmark div.
	var bookmarkDiv = document.createElement("div");
	bookmarkDiv.id = "div"+id;
	bookmarkDiv.style.width = width + "px";
	bookmarkDiv.style.height = height + "px";
	bookmarkDiv.style.margin = margin + "px";
	bookmarkDiv.style.background = "white";
	bookmarkDiv.style.float = "left";
	bookmarkDiv.opacity = 1;
	bookmarkDiv.className = "defaultCategory";
	
	// TODO(cmihail): dev only, delete it
	var bookmarkImage = document.createTextNode("Click anywhere on the div to add/change image\n" + id);
	bookmarkDiv.appendChild(bookmarkImage); 
	bookmarkDiv.onclick = function() {
		var url = window.prompt("Enter iamge url:", "http://");
		if (url != null && url != "") {
			bookmarkDiv.removeChild(bookmarkImage);
			bookmarkImage = document.createElement("img");
			bookmarkImage.src = url;
			bookmarkImage.style.height = bookmarkDiv.style.height;
			bookmarkImage.style.width = bookmarkDiv.style.width;
			bookmarkDiv.appendChild(bookmarkImage);
		}
		// Category
		var category = window.prompt('Choose a category from: \n\n* '+ Categories.getAll() + "\n", 
				'default');
		var categoryCssClass = Categories.getCategoryClass(category);
		bookmarkDiv.className = categoryCssClass;
	};

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


	/**
	 * @return the div for this bookmark
	 */
	this.getDiv = function() {
		return bookmarkDiv;
	};
}
