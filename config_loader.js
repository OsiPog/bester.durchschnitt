function _key() {
	let id = window.location.href.split("/")[4];
	// Artificially making it longer with adding the reversed string
	return id + id.split("").reverse().join("");
}

function _decryptConfig() {
	let conf = new Object();
	let storage = vigenere(localStorage.getItem("bs-durchschnitt"), _key(), decrypt = true);
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
	
	localStorage.setItem("bs-durchschnitt", vigenere(storage, _key()));
}

function getStudentKey() {
	// Finding the h1 element in which the name, class and halfyear are located
	// (Thanks beste.schule devs for putting it there, makes it easy for the config)
	let spans = document.querySelectorAll("div.card-body>h1>span>span");

	let student_name = cleanString(spans[0].innerText);

	// removing all " " (spaces) and "\n" (line breaks).
	let student_class = cleanString(spans[1].innerText);

	let halfyear_small = document.querySelector("div.card-body>h1>small");
	let student_halfyear = cleanString(halfyear_small.innerText);
	
	return student_name[0] + student_class[0] + student_halfyear[0];
}

function getConfig(student_key, subject, key) {
	let conf = _decryptConfig(student_key);
	return conf[cleanString(student_key + subject + key)];
}

function saveConfig(student_key, subject, key, value) {
	let conf = _decryptConfig(student_key);
	
	conf[cleanString(student_key + subject + key)] = value;
	
	_encryptConfig(conf, student_key);
}

function deleteConfig(student_key, subject, key) {
	let conf = _decryptConfig(student_key);
	delete conf[cleanString(student_key + subject + key)];
	_encryptConfig(conf, student_key);
}