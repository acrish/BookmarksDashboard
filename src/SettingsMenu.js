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
			if (resize) {
				//TODO cmihail: resize to default
			}
			
			var orderCriteria = $("#orderingCriteriaSelection input:radio:checked").val();
			//TODO cmihail: order bookmarks on selected criteria
			if (orderCriteria == "dragndrop") {
				alert("Default ordering");
			}
			else if (orderCriteria == "alphabetically") {
				alert("Alphabetical ordering");
			}
			else if (orderCriteria == "oncategory") {
				alert("Order on category");
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

			HideGlobalDialog(false);
			e.preventDefault();
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