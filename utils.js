function round(num, digits=0) {
	return Math.round(num * 10 ** digits)/(10 ** digits);
}

// This function checks if a given string includes a string from the list EXAM_STRINGS
function checkForExamString(string) {
	for (let exam_string of EXAM_STRINGS) {
		if (string.includes(exam_string)) return true;
	}
	return false;
}

// Cleaning a string from "\n" and " "
function cleanString(string) {
	return string.split("\n").join("").split(" ").join("");
}

// Creating Object tree (nested objects), useful for the config creation
function objectTree(keys, object) {
	let level;
	let prev_level = object;
	for(let key of keys) {
		level = prev_level[key];
		if (!level) {
			level = new Object()
			prev_level[key] = level;
		}
		
		prev_level = level;
	}
	
	return level;
}