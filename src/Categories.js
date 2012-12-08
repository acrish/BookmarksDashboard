
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
	input.disabled = disable;
	input.style.margin = "10px";
	categories.insertBefore(input, categories.children[0]);
};
