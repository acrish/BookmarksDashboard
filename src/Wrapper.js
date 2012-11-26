/**
 * Defines the bookmark wrapper class.
 * @param width the width of the wrapper div
 * @param height the height of the wrapper div
 * @param an array with all bookmark wrappers
 * @param options options for creating a bookmark
 * @returns the newly created wrapper object with a bookmark inside.
 */
function Wrapper(width, height, id, options) {
	// Wrap the div so that dropping occurs in a specific area
	var divWrapper = document.createElement("div");
	divWrapper.id = "wrapper" + id;
	divWrapper.style.width = width + "px";
	divWrapper.style.height = height + "px";
	divWrapper.className = "WrapperDiv";
	
	// Wrapper with normal bookmark.
	if (!options['isMockup']) {
		var bookmarkWrappers = options['wrappers'];
		
		// Creates the bookmark.
		var bookmark = new Bookmark(width, height, id, {"isMockup": false});
		divWrapper.appendChild(bookmark.getDiv());
		
		// Drag and drop event handler
		divWrapper.ondrop = function(event) {
			// Exchange div from source wrapper with div from destination wrapper
			event.preventDefault();
			var data = event.dataTransfer.getData("Text");
			var dstDiv = event.target;
			var srcDiv = document.getElementById(data);
			var srcWrapper = srcDiv.parentNode;
			var dstWrapper = dstDiv.parentNode;
			var aux;
			dstWrapper.removeChild(dstDiv);

			// Persist (bkId, json_info) interchanged. If there won't be empty bookmarks in the 
			// dashboard, keep only the body of last if.
			if (localStorage[srcDiv.id] && !localStorage[dstDiv.id]) {
				localStorage[dstDiv.id] = localStorage[srcDiv.id];
				localStorage.removeItem(srcDiv.id);
			}
			else if (!localStorage[srcDiv.id] && localStorage[dstDiv.id]) {
				localStorage[srcDiv.id] = localStorage[dstDiv.id];
				localStorage.removeItem(dstDiv.id);
			}
			else if (localStorage[srcDiv.id] && localStorage[dstDiv.id]) {
				aux = localStorage[srcDiv.id];
				localStorage[srcDiv.id] = localStorage[dstDiv.id];
				localStorage[dstDiv.id] = aux;
			}
			
			// Interchange the bookmarks visually.
			aux = dstDiv.id;
			dstDiv.id = srcDiv.id;
			srcDiv.id = aux;
			bookmarkWrappers[srcWrapper.id].setBookmarkDiv(dstDiv);
			bookmarkWrappers[dstWrapper.id].setBookmarkDiv(srcDiv);
		};
		divWrapper.ondragover = function(event) {
			event.preventDefault();
		};
	} else { // Wrapper with mockup bookmark.
		// TODO
	}
	
	/**
	 * @return the inner bookmark
	 */
	this.getBookmark = function() {
		return bookmark;
	};
	
	/**
	 * @return the wrapper id
	 */
	this.getId = function() {
		return divWrapper.id;
	};
	
	/**
	 * @return the wrapper div
	 */
	this.getDiv = function() {
		return divWrapper;
	};
	
	/**
	 * Resizes the inner bookmark to the wrapper size.
	 */
	this.resizeBookmark = function(width, height) {
		bookmark.setDimensions(width, height);
	};
	
	/**
	 * @param newDiv the new bookmark div
	 */
	this.setBookmarkDiv = function(newDiv) {
		divWrapper.appendChild(newDiv);
		this.getBookmark().setDiv(newDiv);
		this.resizeBookmark($(divWrapper).width(), $(divWrapper).height());
	};
}

function dragAndDrop(divWrapper) {
	divWrapper.ondrop = function(event) {
		// Exchange div from source wrapper with div from destination wrapper
		event.preventDefault();
		var data = event.dataTransfer.getData("Text");
		var dstDiv = event.target;
		var srcDiv = document.getElementById(data);
		var srcWrapper = srcDiv.parentNode;
		var dstWrapper = dstDiv.parentNode;
		var aux;
		dstWrapper.removeChild(dstDiv);

		// Persist (bkId, json_info) interchanged. If there won't be empty bookmarks in the 
		// dashboard, keep only the body of last if.
		if (localStorage[srcDiv.id] && !localStorage[dstDiv.id]) {
			localStorage[dstDiv.id] = localStorage[srcDiv.id];
			localStorage.removeItem(srcDiv.id);
		}
		else if (!localStorage[srcDiv.id] && localStorage[dstDiv.id]) {
			localStorage[srcDiv.id] = localStorage[dstDiv.id];
			localStorage.removeItem(dstDiv.id);
		}
		else if (localStorage[srcDiv.id] && localStorage[dstDiv.id]) {
			aux = localStorage[srcDiv.id];
			localStorage[srcDiv.id] = localStorage[dstDiv.id];
			localStorage[dstDiv.id] = aux;
		}
		
		// Interchange the bookmarks visually.
		aux = dstDiv.id;
		dstDiv.id = srcDiv.id;
		srcDiv.id = aux;
		bookmarkWrappers[srcWrapper.id].setBookmarkDiv(dstDiv);
		bookmarkWrappers[dstWrapper.id].setBookmarkDiv(srcDiv);
	};
	divWrapper.ondragover = function(event) {
		event.preventDefault();
	};
//	alert("T");
}
