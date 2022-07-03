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