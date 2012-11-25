
/**
 * Id generator.
 */
function BkIdGenerator() {
	
}

BkIdGenerator.idTemplate = 'bookmark';

/**
 * Generate the first unused id.
 * @returns the first unused id
 */
BkIdGenerator.getNextId = function() {
	var i = 0;
	var currId = BkIdGenerator.idTemplate + i;
	
	while (localStorage[currId] != null) {
		currId = BkIdGenerator.idTemplate + i;
		i++;
	}
	
	return currId;
};

/**
 * Generate an id based on the number given as parameter.
 * @param which suffix of template
 * @returns id
 */
BkIdGenerator.getId = function(which) {
	
	return BkIdGenerator.idTemplate + which;
};