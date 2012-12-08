
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
Categories.load = function() {
	localStorage['categories'] = Categories.validCategories;
	var categories = Categories.validCategories;
	for (categ in categories) {
		Categories.addCss(categ, categories[categ]);
	}
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
 * @param doc
 */
Categories.populateDialogBox = function() {
	var categories = document.getElementById("categories");
	var i = 0;
	for (c in Categories.validCategories) {
		i++;
		var input = document.createElement("input");
		input.type = "radio";
		input.id = "categ" + i;
		input.name = "categ";
		input.value = c;
		categories.appendChild(input);
		
		var span = document.createElement("span");
		span.innerHTML = c;
		span.style.color = Categories.validCategories[c];
		categories.appendChild(span);
	}
};
