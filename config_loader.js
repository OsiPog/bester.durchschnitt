// A function to get the current config
// It is to assume that the current page is already the marks page.

function getStudentKey() {
	// Finding the h1 element in which the name, class and halfyear are located
	// (Thanks beste.schule devs for putting it there, makes it easy for the config)
	let spans = document.querySelectorAll("div.card-body>h1>span>span");

	let student_name = cleanString(spans[0].innerText);

	// removing all " " (spaces) and "\n" (line breaks).
	let student_class = cleanString(spans[1].innerText);

	let halfyear_small = document.querySelector("div.card-body>h1>small");
	let student_halfyear = cleanString(halfyear_small.innerText);
	
	return student_name + student_class + student_halfyear;
}

function getConfig(student_key, subject, key) {
	return localStorage.getItem(student_key + subject + key);
}

function saveConfig(student_key, subject, key, value) {
	localStorage.setItem(student_key + subject + key, value);
}

function deleteConfig(student_key, subject, key) {
	localStorage.removeItem(student_key + subject + key);
}