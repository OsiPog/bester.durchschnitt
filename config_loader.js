let addon_storage;
// A function to get the current config
// It is to assume that the current page is already the marks page.

function getKeyName(subject, key) {
	// Finding the h1 element in which the name, class and halfyear are located
	// (Thanks beste.schule devs for putting it there, makes it easy for the config)
	let spans = document.querySelectorAll("div.card-body>h1>span>span");
	let student_name = cleanText(spans[0].innerText);
	// removing all " " (spaces) and "\n" (line breaks).
	let student_class = cleanString(spans[1].innerText);
	
	let halfyear_small = document.querySelector("div.card-body>h1>small");
	let student_halfyear = halfyear_small.innerText;
	
	return student_name + student_class + student_halfyear + subject + key;
}

function getConfig(subject, key) {
	let item_name = getKeyName(subject, key);
	
	localStorage.setItem(item_name, value);
}

function saveConfig(subject, key, value) {
	let item_name = getKeyName(subject, key);

	localStorage.setItem(item_name, value);
}