/**
 * Defines the bookmark wrapper class.
 * @param width the width of the wrapper div
 * @param height the height of the wrapper div
 * @returns the newly created wrapper object with a bookmark inside.
 */
function Wrapper(width, height, id) {
	// Wrap the div so that dropping occurs in a specific area
	var divWrapper = document.createElement("div");
	divWrapper.id = "wrapper" + id;
	divWrapper.style.width = width + "px";
	divWrapper.style.height = height + "px";
	divWrapper.style.background = "#fff";
	divWrapper.style.float = "left";
	
	// Drag and drop event handler
	divWrapper.ondrop = function(event) {
		// Exchange div from source wrapper with div from destination wrapper
		event.preventDefault();
		var data = event.dataTransfer.getData("Text");
		var dstDiv = event.target;
		var srcDiv = document.getElementById(data);
		var srcWrapper = srcDiv.parentNode;
		var dstWrapper = dstDiv.parentNode;
		dstWrapper.removeChild(dstDiv);
		dstWrapper.appendChild(srcDiv);
		srcWrapper.appendChild(dstDiv);
	};
	divWrapper.ondragover = function(event) {
		event.preventDefault();
	};
	
	// Creates the bookmark.
	var bookmark = new Bookmark(width, height, id);
	divWrapper.appendChild(bookmark.getDiv());
	
	/**
	 * @return the wrapper div
	 */
	this.getWrapper = function() {
		return divWrapper;
	};
	
	/**
	 * Resizes the inner bookmark to the wrapper size.
	 */
	this.resizeBookmark = function(width, height) {
		bookmark.setDimensions(width, height);
	};
}