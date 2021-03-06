/**
 * Defines the bookmark wrapper class.
 * @param width the default width of the wrapper div
 * @param height the default height of the wrapper div
 * @param an array with all bookmark wrappers
 * @param options the options for creating a wrapper
 * @returns the newly created wrapper object with a bookmark inside.
 */
function Wrapper(width, height, id, options) {
	var margin = options['margin'];
	
	// Wrap the div so that dropping occurs in a specific area
	var divWrapper = document.createElement("div");
	divWrapper.id = "wrapper" + id;
	divWrapper.className = "WrapperDiv";
	divWrapper.style.margin = margin + "px";
	
	var widthRatio = 1;
	var heightRatio = 1;
	
	// Wrapper with normal bookmark.
	var bookmark;
	if (!options['isMockup']) {
		// Set width and height.
		info = localStorage[options['localStorageId']];
		if (info == null) {
			alert("There was an internal problem");
		}
		var obj = JSON.parse(info);
		widthRatio = obj.widthRatio;
		heightRatio = obj.heightRatio;
		
		var wrapperWidth = calculateNewDimension(width, widthRatio, margin);
		var wrapperHeight = calculateNewDimension(height, heightRatio, margin);
		$(divWrapper).width(wrapperWidth);
		$(divWrapper).height(wrapperHeight);
		
		// Creates the bookmark.
		bookmark = new Bookmark(wrapperWidth, wrapperHeight, id, 
				{"isMockup": false, 'localStorageId': options['localStorageId']});
		divWrapper.appendChild(bookmark.getDiv());

		// Drag and drop event handler
		if (options['draggable']) {
			dragAndDrop(divWrapper, options['wrappers']);
		}
	} else { // Wrapper with mockup bookmark.
		$(divWrapper).width(width);
		$(divWrapper).height(height);
		
		bookmark = new Bookmark(width, height, id, {"isMockup": true});
		
		divWrapper.appendChild(bookmark.getDiv());
		divWrapper.onclick = function () { window.open("addLinkPopup.html", 'Add Bookmark','height=225,width=220'); };
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
	this.resize = function(newWidthRatio, newHeightRatio) {
		widthRatio = newWidthRatio;
		heightRatio = newHeightRatio;
		var newWidth = calculateNewDimension(width, newWidthRatio, margin);
		var newHeight = calculateNewDimension(height, newHeightRatio, margin);
		bookmark.setDimensions(newWidth, newHeight);
		
		// Save new settings.
		info = localStorage[options['localStorageId']];
		if (info == null) {
			alert("There was an internal problem");
		}
		var obj = JSON.parse(info);
		obj.widthRatio = newWidthRatio;
		obj.heightRatio = newHeightRatio;
		localStorage[options['localStorageId']] = JSON.stringify(obj);
	};

	/**
	 *  Resizes the wrapper and the inner bookmark.
	 */
	this.resizeWrapper = function(newWidthRatio, newHeightRatio) {
		widthRatio = newWidthRatio;
		heightRatio = newHeightRatio;
		var newWidth = calculateNewDimension(width, newWidthRatio, margin);
		var newHeight = calculateNewDimension(height, newHeightRatio, margin);
		$(divWrapper).width(newWidth);
		$(divWrapper).height(newHeight);
		bookmark.setDimensions(newWidth, newHeight);
	};
	
	/**
	 * Sets the new bookmark div.
	 */
	this.setBookmarkDiv = function(newDiv) {
		divWrapper.appendChild(newDiv);
		this.getBookmark().setDiv(newDiv);
		this.resize(widthRatio, heightRatio);
	};
}

/**
 * @param length
 * @param ratio
 * @param margin
 */
function calculateNewDimension(length, ratio, margin) {
	return length * ratio + margin * (ratio - 1) * 2;
}

/**
 * @param divWrapper the div of the wrapper that becomes draggable
 * @param bookmarkWrappers a list with all bookmark wrappers
 */
function dragAndDrop(divWrapper, bookmarkWrappers) {
	divWrapper.ondrop = function(event) {
		// Exchange div from source wrapper with div from destination wrapper
		event.preventDefault();
		var data = event.dataTransfer.getData("Text");
		var dstDiv = event.target;
		var srcDiv = document.getElementById(data);
		var srcWrapperDiv = srcDiv.parentNode;
		var dstWrapperDiv = dstDiv.parentNode;
		
		// Drag and drop shouldn't be used on divs that don't have bookmarks inside.
		if (!localStorage[srcDiv.id] || !localStorage[dstDiv.id]) {
			return;
		}
		dstWrapperDiv.removeChild(dstDiv);

		// Persist (bkId, json_info) interchanged.
		var aux;
		aux = localStorage[srcDiv.id];
		localStorage[srcDiv.id] = localStorage[dstDiv.id];
		localStorage[dstDiv.id] = aux;
				
		// Interchange the bookmarks visually.
		aux = dstDiv.id;
		dstDiv.id = srcDiv.id;
		srcDiv.id = aux;
		bookmarkWrappers[srcWrapperDiv.id].setBookmarkDiv(dstDiv);
		bookmarkWrappers[dstWrapperDiv.id].setBookmarkDiv(srcDiv);
		
		// Resize bookmarks to new values.
		var obj = JSON.parse(localStorage[srcDiv.id]);
		bookmarkWrappers[srcWrapperDiv.id].resizeWrapper(obj.widthRatio, obj.heightRatio);
		obj = JSON.parse(localStorage[dstDiv.id]);
		bookmarkWrappers[dstWrapperDiv.id].resizeWrapper(obj.widthRatio, obj.heightRatio);
	};
	divWrapper.ondragover = function(event) {
		event.preventDefault();
	};
}
