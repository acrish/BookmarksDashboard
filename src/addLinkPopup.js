
	//alert("intra pe aici--------??");
	function getLink() {
		//alert("intra pe aici??");
		chrome.tabs.getSelected(null, function(tab) {
		document.getElementById("tabUrl").value = tab.url;
		document.getElementById("tabTitle").value = tab.title;
		});
	}
	function addBookmark() {
		//Adding bookmark
		var url=document.getElementById("tabUrl").value;
		var category=document.getElementById("category").value;
		if (category == "")
			category = "Default";
		
		var noLinks = localStorage["noLinks"];
		if (! noLinks)
			localStorage["noLinks"] = 0;
		var name="tab"+ noLinks;
		localStorage[name] = url;
		
		noLinks ++;
		localStorage["noLinks"] = noLinks;
		
		window.close();
	}

	function closePopup() {
		window.close();
	}
	document.addEventListener('DOMContentLoaded', function () {
		var divs = document.querySelectorAll('button');
		for (var i = 0; i < divs.length; i++) {
			divs[i].addEventListener('click', addBookmark);}
	});
	getLink();