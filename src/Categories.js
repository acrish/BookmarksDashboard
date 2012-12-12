
function Categories() {
	
}

/**
 * Static fields and methods of class Categories
 */
Categories.defaultCategories = {'default' : 'orange',
		'fun': 'purple',
		'social' : 'blue'};
Categories.validCategories = Categories.defaultCategories;
Categories.maxSize = 6;

/**
 * Expecting to have an associative array in local store with name of category as key and color of 
 * category as value; if not add the default one.
 */
Categories.load = function(globalSettNewCateg) {
	var categories = {};
	if (localStorage['Allcategories'] == null) {
		localStorage['Allcategories'] = Categories.getAll();
		categories = Categories.validCategories;
	}
	else {	
		var categs = localStorage['Allcategories'].split("\n");
		for (var i = 0; i < categs.length; i++) {
			var splitted = categs[i].split(" - ");
			categories[splitted[0]] = splitted[1];
		}			
		Categories.validCategories = categories;
	}
	
	for (categ in categories) {
		Categories.addCss(categ, categories[categ]);
	}
	
	Categories.populateDialogBox("existingCategories", true);
	
};

Categories.addCss = function(category, color) {
	var style = document.createElement('style');
	style.type = 'text/css';
	var catClass = Categories.getCategoryClass(category);
	style.innerHTML = '.' + catClass + ' { box-shadow: 10px 10px 5px ' + color + '; border-radius: 10px;}';
	document.getElementsByTagName('head')[0].appendChild(style);
};

Categories.getCategoryClass = function(category) {
	var cat = category.toLowerCase();
	if (Categories.validCategories[cat] == -1)
		cat = 'default';
	return cat + "Category";
};

Categories.add = function(category, color) {
	var size = Categories.size();
	if (size == Categories.maxSize)
		return false;
	
	if (Categories.validCategories[category] != null)
		return false;
	
	Categories.validCategories[category] = color;
	Categories.addCss(category, color);
	localStorage['Allcategories'] = Categories.getAll();
	var categories = document.getElementById("existingCategories");	
	Categories.addToDialogBox(categories, true, category, size+1);
	
	return true;
};

Categories.getAll = function() {
	return Object.keys(Categories.validCategories).map(
			function(x) {return x + " - " + Categories.validCategories[x];}
			).join('\n');
};

Categories.size = function() {
	var categories = Categories.validCategories;
	var length = 0;
	for (categ in categories) {
		length++;
	}

	return length;
};

/**
 * Populate a dialog box with radio buttons for the existing categories.
 *
 * @param dialogBox which dialog box to populate
 * @param disable if they can be selected
 */
Categories.populateDialogBox = function(dialogBox, disable) {
	var categories = document.getElementById(dialogBox);
	var i = 0;
	for (c in Categories.validCategories) {
		i++;
		Categories.addToDialogBox(categories, disable, c, i);
	}
};

Categories.addToDialogBox = function (categories, disable, c, i){
	var span = document.createElement("span");
	span.innerHTML = c;
	span.style.color = Categories.validCategories[c];
	categories.insertBefore(span, categories.children[0]);
	
	var input = document.createElement("input");
	input.type = "radio";
	input.id = "categ" + i;
	input.name = "categ";
	input.value = c;
	input.style.margin = "10px";
	if (disable) {
		input.onclick = function() {
			var old_categ_name = c;
			var old_categ_color = Categories.validCategories[c];
			var new_name_default = document.getElementById("new_name");
			new_name_default.value = c;
			
			var globalDialog = document.getElementById('global_dialog');
			globalDialog.style.opacity = 0.7;
			
			var overlay = document.getElementById("overlay");
			overlay.style.zIndex = parseInt(overlay.style.zIndex) + 10; //TODO why doesn't work?
			$("#overlay").show();
			$("#edit_categ_dialog").fadeIn(300);
	        $("#overlay").unbind("click");
			// Prevent triggering click events for past binded objects and bind the current one.
			$("#btnSubmitEditCateg").unbind("click");
			$("#btnSubmitEditCateg").click(function (e) {
				var newCategName = $("#new_name").val();
				var newCategColor = $("#new_color").val();
				if (newCategName != "" && newCategColor != "") {
					for (var id = 0; localStorage[BkIdGenerator.getId(id)] != null; id++) {
						var obj = JSON.parse(localStorage[BkIdGenerator.getId(id)]);
						if (obj.categ == old_categ_name) {
							obj.categ = newCategName;
						}
						localStorage[BkIdGenerator.getId(id)] = JSON.stringify(obj);
					}
					delete Categories.validCategories[old_categ_name];
					Categories.validCategories[newCategName] = newCategColor;
					span.style.color = newCategColor;
					span.innerHTML = newCategName;
					localStorage['Allcategories'] = Categories.getAll();
				}
				overlay.style.zIndex = parseInt(overlay.style.zIndex) - 10;
				HideDialog("edit_categ_dialog");
				globalDialog.style.opacity = 1;
			});
		};
	}
	categories.insertBefore(input, categories.children[0]);
};
