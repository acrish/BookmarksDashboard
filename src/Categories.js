
function Categories() {
	
}

/**
 * Static fields and methods of class Categories
 */
Categories.validCategories = new Array('default', 'fun', 'social');

Categories.getCategoryClass = function(category) {
	var cat = category.toLowerCase();
	if (Categories.validCategories.indexOf(cat) == -1)
		cat = 'default';
	return cat + "Category";
};

Categories.getAll = function() {
	return Categories.validCategories.join('\n* ');
};

/**
 * Populate a dialog box with radio buttons for the existing categories.
 *
 * @param doc
 */
Categories.populateDialogBox = function() {
	var categories = document.getElementById("categories");
	var n = Categories.validCategories.length;
	for (var i = 0; i < n; i++) {
		var c = Categories.validCategories[i];
		var input = document.createElement("input");
		input.type = "radio";
		input.id = "categ" + i;
		input.name = "categ";
		input.value = c;
		categories.appendChild(input);
		
		var span = document.createElement("span");
		span.innerHTML = c;
		categories.appendChild(span);
	}
};
