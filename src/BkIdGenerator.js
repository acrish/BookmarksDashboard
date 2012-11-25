
/**
 * Id generator.
 */
function BkIdGenerator() {
	
}

BkIdGenerator.idTemplate = 'bookmark';

BkIdGenerator.getNextId = function() {
	var i = 0;
	var currId = BkIdGenerator.idTemplate + i;
	
	while (localStorage[currId] != null) {
		currId = BkIdGenerator.idTemplate + i;
		i++;
	}
	
	return currId;
};

BkIdGenerator.getId = function(which) {
	
	return BkIdGenerator.idTemplate + which;
};