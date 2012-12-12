/**
 * Create settings menu, implement onclick listener on settings icon and decide what happens on 
 * changes.
 * 
 * @param globalSettings global settings icon
 */
function createSettingsMenu(globalSettings) {
	populateBackgroundSelection();
	$("#bgImg").unbind("click");
	
	globalSettings.onclick = function() {
		onHoverButtonClick = true;
		$("#overlay").show();
		$("#global_dialog").fadeIn(300);
        $("#overlay").unbind("click");
        $("#btnCloseSettings").unbind("click");
		$("#btnCloseSettings").click(function (e) {
		     HideGlobalDialog(true);
		     e.preventDefault();
		  });
		
		$("#btnSubmitSettings").unbind("click");
		$("#btnSubmitSettings").click(function (e) {
			var resize = $("input[name='resize']:checkbox:checked").val();
			var clearAll = $("input[name='clearAll']:checkbox:checked").val();
			
			if (resize) {
				for (var id = 0; localStorage[BkIdGenerator.getId(id)] != null; id++) {
					var obj = JSON.parse(localStorage[BkIdGenerator.getId(id)]);
					obj.widthRatio = 1;
					obj.heightRatio = 1;
					localStorage[BkIdGenerator.getId(id)] = JSON.stringify(obj);
				}
			}
			
			var orderCriteria = $("#orderingCriteriaSelection input:radio:checked").val();
			if (orderCriteria == "dragndrop") {
				var displayOrder = {
					order: "default",
				};
				localStorage["displayOrder"] = JSON.stringify(displayOrder);
			}
			else if (orderCriteria == "alphabetically") {
				var displayOrder = {
					order: "alphabetical",
				};
				localStorage["displayOrder"] = JSON.stringify(displayOrder);
			}
			else if (orderCriteria == "oncategory") {
				var displayOrder = {
					order: "category",
				};
				localStorage["displayOrder"] = JSON.stringify(displayOrder);
			}
			
			var selectedBg = $("#backgroundImageSelect option:selected").val();
			if (selectedBg != "None") {
				localStorage["bgImage"] = selectedBg;
				$("html").css("background-image", 'url(' + selectedBg + ')');
				$("html").css("background-repeat", "repeat");
			}
			else {
				localStorage.removeItem("bgImage");
				$("html").css("background", '#fff');
			}

			var newCategName = $("#new_categ_name").val();
			var newCategColor = $("#new_categ_color").val();
			if (newCategName != "" && newCategColor != "") 
				if (Categories.size() < Categories.maxSize) {
					Categories.add(newCategName, newCategColor);
				}
				else
					alert("Too many categories already!");
			
			// Clear local storage
			if (clearAll && confirm("Do you really want to remove all your bookmarks?")) {
				localStorage.clear();
				localStorage["page"] = 0;
			}
			
			HideGlobalDialog(false);
			e.preventDefault();
			
			// Refresh all new tab pages to show the new bookmark.
			var views = chrome.extension.getViews();
			for (var i in views) {
				var location = views[i].location;
				location.reload();
			}
		});
	};
}

/**
 * Called to close the dialog popup window.
 */
function HideGlobalDialog(ask) {
	if (ask && confirm("Quit without saving your settings?") || !ask) {
	   $("#overlay").hide();
	   $("#global_dialog").fadeOut(300);
	}
}

function populateBackgroundSelection() {
	var bgSel = document.getElementById("backgroundImageSelect");
	var path = "images/backgroundImages/";
	var pics = new Array("background-4-line.jpg", "plain_blue.jpg", "Splashscreen.jpg", 
			"Tan_Plain_Background_New.jpg");
	var filename;
	var option;
	var currBgImg = localStorage['bgImage'];
	for (var i = 0; i < pics.length; i++) {
		filename = path + pics[i];
		option = document.createElement("option");
		option.value = filename;
		option.innerHTML = pics[i];
		if (currBgImg == filename)
			option.selected = "selected";
		bgSel.appendChild(option);
	}
}