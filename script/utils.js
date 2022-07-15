// Randomly shuffled alphabet with capital, lowerace and special characters
const LETTERS = "YP$m-q6Z0<D92!+Tl81np_vEwiGzQXJ?sr4jth7e5OFBVxNWUuHAKkC%gayo§dc#3bfL>MI*R&S"

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

// Cleaning a string from "\n" and " " and only allowing chars from LETTERS
function cleanString(string) {
	let cleaned = "";
	for (let c of string.split("\n").join("").split(" ").join("")) {
		if (LETTERS.includes(c)) cleaned += c;
	}
	
	return cleaned;
}

// Creating Object tree (nested objects), useful for the config creation
function objectTree(keys, object) {
	let level;
	let prev_level = object;
	for(let key of keys) {
		level = prev_level[key];
		if (!level) {
			level = new Object();
			prev_level[key] = level;
		}
		
		prev_level = level;
	}
	
	return level; // return the last level/layer of the tree
}





function vigenere(string, key_string, decrypt = false) {
	if ((string === "") || (key_string === "") || !string || !key_string) return;
	
	// Going through the whole string
	let key, index;
	let new_string = "";
	for(let i=0;i<string.length; i++) {
		key_char = key_string[i%key_string.length];
		// Skip if any character is not in the table
		if (!LETTERS.includes(string[i]) || !LETTERS.includes(key_char)) {
			new_string += string[i];
			continue;
		}
		
		// Getting the amount of shifting of the current char
		key = LETTERS.indexOf(key_char);
		if (decrypt) key *= -1;
		
		index = LETTERS.indexOf(string[i]) + key;
		if (index > LETTERS.length-1) index -= LETTERS.length;
		if (index < 0) index += LETTERS.length;
		new_string += LETTERS[index];
	}
	
	return new_string;
}