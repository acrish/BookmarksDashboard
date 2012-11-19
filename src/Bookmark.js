/**
 * Defines the bookmark class.
 * @param width the width of the bookmark div
 * @param height the height of the bookmark div
 * @param margin the margin of the bookmark div
 * @returns the newly created bookmark object
 */
function Bookmark(width, height, margin) {
	// Create bookmark div.
	var bookmarkDiv = document.createElement("div");
	bookmarkDiv.style.width = width + "px";
	bookmarkDiv.style.height = height + "px";
	bookmarkDiv.style.margin = margin + "px";
	bookmarkDiv.style.background = "white";
	bookmarkDiv.style.float = "left";
	
	// TODO(cmihail): dev only, delete it
	var bookmarkImage = document.createTextNode("Click anywhere on the div to add/change image");
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
	};
	
	/**
	 * @return the div for this bookmark
	 */
	this.getDiv = function() {
		return bookmarkDiv;
	};
}
