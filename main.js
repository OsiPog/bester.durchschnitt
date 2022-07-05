// This is not a very elegant way to figure out if a column is for exam marks but as
// I don't have an API nor does the Website provide any information about it I have to
// do it like this.
const EXAM_STRINGS = ["KL", "Klausur", "KA", "Kl", "Klassenarbeit", "Ka"];

const SELECT_OPTIONS = ["Sonstige", "KA/Klausur", "ignorieren"];

const ERRORS = {
	"CannotGetConfig": "CannotGetConfig: The current page doesn't contain marks."
}


let _last_quick_update = 0;

function updateAverage(delay = 10) {
	// The timeout is set because the site has an internal loader.
	setTimeout(function() {
		// // To differenciate if it got clicked on the body or on the card.
		// let time_now = new Date().getTime();
		// if (delay <= 50) {
			// _last_quick_update = time_now;
		// }
		// // It shouldn't update twice if it got clicked on the body and on the card.
		// else if (time_now - _last_quick_update <= 1000) {
			// return;
		// }
		
		// If the current website isn't the website containing the marks. return. 
		if (!window.location.href.includes("grades")) return;
		
		// Getting the view-type of the marks as this has an impact on how to get the marks
		// from the website.
		// If the checkbox "overview" isn't checked, return because it isn't supported.
		let _overview_checkbox = document.querySelector("div.custom-control>input");
		if (_overview_checkbox && (!_overview_checkbox.checked)) return;
		
		// Getting all subject divs
		let all_subject_divs = document.querySelectorAll("div.card-body>div");
		
		// If the web app hasn't fully loaded yet try again updating after 100ms.
		if (all_subject_divs.length === 0) {
			updateAverage(100);
			return;
		}
		
		// Getting the student key, important for saving things to the config.
		let student_key = getStudentKey();
		
		let overall_average = 0;
		let overall_av_len = 0;
		
		// Going through all subject divs
		for (let subject_div of all_subject_divs) {

			// This <p> element will only be present if the subject has no marks (yet).
			// if it has no marks, skip it.
			if (subject_div.querySelector("p")) continue; 


			let subject_label = subject_div.querySelector("h2");
			
			// The first child element of this h2 is a span with the title inside.
			let subject_title = cleanString(subject_label.children[0].innerText);
			
			let mark_lists = subject_div.querySelectorAll("tr>td");
			let headers = subject_div.querySelectorAll("tr>th");
			
			// Creating the dropdown menus and updating columns.
			let select_states = new Array();
			
			for (let i = 0;i < headers.length-1; i++) {
				
				let header = headers[i];
				let header_string = cleanString(header.innerText);
				

				// Getting a reference to the select element (creating it if it has to)
				let [select, just_created] = dropdownMenu(header);

				// Getting the default settings
				let default_val = "0";
				
				// If the header string contains an exam string change the
				// dropdown menu to exam marks (user usability).
				if (checkForExamString(header_string)) {
					default_val = "1";
				}

				// Loading the current for the header
				let conf = getConfig(student_key, subject_title, header_string);

				// If the select menu just got created check for a config that has been
				// set before, if there is none, just take the default value.
				if (just_created) {
					
					// If theres no config or the default is exams change it to the default.
					if (!conf || default_val === "1") {
						select.value = default_val;
					}
					else if (conf !== default_val) {
						select.value = conf;
					}
				}
				// If the select menu didn't just get created see if the default value is
				// not equal to the selected value or if the config (if one exists) is not
				// not equal to the selected value. If these conditions are true. Save a
				// new config.
				else if ((default_val !== select.value) || (conf && (conf !== select.value))) {
					saveConfig(student_key, subject_title, header_string, select.value);
				}
				
				// For the case that a config is obsolete and would just waste storage.
				else if ((default_val === select.value) && conf) {
					deleteConfig(student_key, subject_title, header_string);
				}
				
				// Keeping track of the values for the calculations.
				select_states.push(select.value);
				
				// If the dropdown menu is set to "ignore" make it visible to the user.
				// (column greyed out)
				
				let style = "";
				
				if (select.value === "1") {
					style = "color:#AA0000 !important";
				}
				else if (select.value === "2") {
					style = "color:#A0A0A0 !important";
				}
				
				header.setAttribute("style",style);
				mark_lists[i].setAttribute("style",style);
			}
			
			
			
			// Creating the slider to determine the ratio of exam and others
			// (But only if the subject even has exam marks, if it doesnt, delete slider)
			// "1" is exams in the drop down menu
			
			let only_exams = !select_states.includes("0");
			let only_others = !select_states.includes("1");
			let exam_weight;
			
			let [slider, just_created] = ratioSlider(headers[headers.length-1], (only_exams || only_others));
			
			if (!(only_exams || only_others)) {
				let conf = getConfig(student_key, subject_title, "slider");

				if (just_created && conf) {
					slider.value = conf;
				}
				else if (!conf && (slider.value !== "50")) {
					saveConfig(student_key, subject_title, "slider", slider.value);
				}
				else if (conf && (slider.value === "50")){
					deleteConfig(student_key, subject_title, "slider");
				}
				
				exam_weight = Number(slider.value);
			}
			else if (only_exams) {
				exam_weight = 100;
			}
			else if (only_others) {
				exam_weight = 0;
			}
			
			let average_exams = 0;
			let exams_amount = 0;
			
			let average_others = 0;
			let others_amount = 0;
			
			for (let i = 0;i < headers.length-1; i++) { // The last column is empty
				
				if (select_states[i] === "2") continue; // "2" is "ignore"
				
				let mark_elements = mark_lists[i].querySelectorAll("div>span");

				for (let mark_element of mark_elements) {
					// parseInt() and not Number() because it could be e.g. "1-"
					let mark = parseInt(mark_element.innerHTML)
					
					// Sometimes tests which haven't been attended are marked as "-".
					// Thus, parseInt() will return a NaN.
					if (Number.isNaN(mark)) continue;
					
					// "1" is "exam marks"
					if (select_states[i] === "1") {
						average_exams += mark;
						exams_amount++;
					}
					else {
						average_others += mark;
						others_amount++;
					}
					
				}
			}
			let average = 0;

			if (others_amount !== 0) {
				average_others /= others_amount;
				average += average_others*(100 - exam_weight);
			}
			if (exams_amount !== 0) {
				average_exams /= exams_amount;
				average += average_exams*exam_weight;
			}
			
			average /= 100; // All weights added up
			
			if (!Number.isNaN(average)) {
				overall_average += round(average);
				overall_av_len++;
			}
			
			textSpan(subject_label, average);
			
			
		}
		
		// putting the overall average next to the half year text
		overall_average = overall_average/overall_av_len;
		
		let halfyear_selected = document.querySelector("nav>a.active");
		
		textSpan(halfyear_selected, overall_average);
		
	}, delay);
}
console.log("Add-On loaded");
// Add click event listeners
document.body.addEventListener("click", updateAverage);

// This will be execute after a site loaded.
// This exists for the case that the current site is already the right one and no click has to 
// be made
updateAverage();
