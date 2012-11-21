
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