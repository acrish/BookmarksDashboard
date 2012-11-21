function setLink(myLink) {
}
function addBookmark(myform) {
	if (myform.bookmarkName.value != "") {
		//adaugaLink(); persistent
		//grid.append(var);
		
		var div=document.createElement('div');
		div.innerHTML="<a href='"+ myform.bookmarkName.value +"'> Link1 </a>";
		
		window.opener.document.body.appendChild(div);//('text1').value
	}
	//myform.bookmarkName.value="" // reset value
	this.close();
}

function click(e) {
	/*
	The following line of code will give us information about the tab currently selected
	in the browser window.  For example tab.id will give us the id of the selected tab.
	*/
	chrome.tabs.getSelected(null, function(tab) {
		/*
		The following line of code will send what is called a request to the content
		scripts(B) that you have added to the original pages.  It's like making a phone
		call but in order for someone to here the ring on the other end, there must  a
		'listener' as you will see later
		*/
		chrome.tabs.sendRequest(tab.id, {
										 'action': 'addBookmark',
										 'data'  : {'bookmarkName' : tab.url}
										 });
	}
}

  chrome.tabs.executeScript(null, {file: "content_script.js"});
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});

