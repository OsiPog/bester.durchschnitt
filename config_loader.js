let addon_storage = localStorage["bs-durchschnitt"];

// In the case that this is the first use of the Add-On.
if (!addon_storage) {
	addon_storage = new Object();
	localStorage["bs-durchschnitt"] = addon_storage;
}

// A function to get the current config
// It is to assume that the current page is already the marks page.
function getConfig(subject) {
	
	// Finding the h1 element in which the name, class and halfyear are located
	// (Thanks beste.schule devs for putting it there, makes it easy for the config)
	let spans = document.querySelectorAll("div.card-body>h1>span>span");
	let student_name = spans[0].innerText;
	// removing all " " (spaces) and "\n" (line breaks).
	let student_class = cleanString(spans[1].innerText);
	
	let halfyear_small = document.querySelector("div.card-body>h1>small");
	let student_halfyear = halfyear_small.innerText;

	// Making sure subject and header_string are nice and clean
	subject = cleanString(subject);
	
	return objectTree([	
						student_name, 
						student_class, 
						student_halfyear,
						subject
					], addon_storage);
}



