/**
 * Defines the bookmark wrapper class.
 * @param width the width of the wrapper div
 * @param height the height of the wrapper div
 * @param margin the margin of the bookmark div
 * @returns the newly created wrapper object with a bookmark inside.
 */
function Wrapper(width, height, margin, id) {
	// Wrap the div so that dropping occurs in a specific area
	var divWrapper = document.createElement("div");
	divWrapper.id = "wrapper" + id;
	divWrapper.style.width = width + "px";
	divWrapper.style.height = height + "px";
	divWrapper.style.background = "silver";
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
	
	var bookmark = new Bookmark(width, height, margin, id);
	divWrapper.appendChild(bookmark.getDiv());
	this.getBookmark = function() {
		return bookmark;
	};
	
	this.wrapper = divWrapper;
	this.getWrapper = function() {
		return wrapper;
	};
}