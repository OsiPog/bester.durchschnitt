let addon_storage = localStorage["bs-durchschnitt"];

// In the case that this is the first use of the Add-On.
if (!addon_storage) {
	addon_storage = new Object();
	localStorage["bs-durchschnitt"] = addon_storage;
}

// A function to get the current config
function get_current_config() {
	if (!window.location.href.includes("grades")) 
		throw ERRORS["CannotGetConfig"];
	
	
	let spans = document.querySelectorAll("div.card-body>h1>span>span");
	let student_name = spans[0].innerText;
	// removing all " " (spaces) and "\n" (line breaks).
	let student_class = spans[1].innerText.split("\n").join("").split(" ").join("");
	
	let halfyear_small = document.querySelector("div.card-body>h1>small");
	let student_halfyear = halfyear_small.innerText;
	
	if (!addon_storage[student_name]) {
		addon_storage[student_name] = new Object();
	}
	
	if (!addon_storage[student_name][student_class]) {
		addon_storage[student_name][] = new Object();
	}
}