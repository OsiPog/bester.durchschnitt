function _decryptConfig() {
	let conf = new Object();
	let storage = vigenere(localStorage.getItem("bs-durchschnitt"), key_string = "bs-durchschnitt", decrypt = true);
	if (!storage) return conf;
	let key, value;
	for (let entry of storage.split(",")) {
		[key, value] = entry.split("=");
		conf[key] = value;
	}
	
	return conf;
}

function _encryptConfig(conf_obj) {
	let storage = "";
	let whole_string;

	for (let key in conf_obj) {
		whole_string = key + "=" + conf_obj[key]
		
		if (storage !== "") storage += ",";
		storage += whole_string;
	}
	
	localStorage.setItem("bs-durchschnitt", vigenere(storage, key_string = "bs-durchschnitt"));
}

function getStudentKey() {
	// Finding the h1 element in which the name, class and halfyear are located
	// (Thanks beste.schule devs for putting it there, makes it easy for the config)
	let spans = document.querySelectorAll("div.card-body>h1>span>span");

	let student_name = spans[0].innerText;

	// removing all " " (spaces) and "\n" (line breaks).
	let student_class = spans[1].innerText;

	let halfyear_small = document.querySelector("div.card-body>h1>small");
	let student_halfyear = halfyear_small.innerText;
	
	return cleanString(student_name + student_class + student_halfyear);
}

function getConfig(student_key, subject, key) {
	let conf = _decryptConfig();
	
	return conf[cleanString(student_key + subject + key)];
}

function saveConfig(student_key, subject, key, value) {
	let conf = _decryptConfig();
	
	conf[cleanString(student_key + subject + key)] = value;
	
	_encryptConfig(conf);
}

function deleteConfig(student_key, subject, key) {
	let conf = _decryptConfig();
	delete conf[cleanString(student_key + subject + key)];
	_encryptConfig(conf);
}