// This is not a very elegant way to figure out if a column is for exam marks but as
// I don't have an API nor does the Website provide any information about it I have to
// do it like this.
const EXAM_STRINGS = ["KL", "Klausur", "KA", "Kl", "Klassenarbeit", "Ka"];

const SELECT_OPTIONS = ["Sonstige", "KA/Klausur", "ignorieren"];

const ERRORS = {
	"CannotGetConfig": "CannotGetConfig: The current page doesn't contain marks."
}


let _last_quick_update = 0;

function updateAverage(delay = 0) {
	// The timeout is set because the site has an internal loader.
	setTimeout(function() {
		// To differenciate if it got clicked on the body or on the card.
		let time_now = new Date().getTime();
		if (delay <= 50) {
			_last_quick_update = time_now;
		}
		// It shouldn't update twice if it got clicked on the body and on the card.
		else if (time_now - _last_quick_update <= 1000) {
			return;
		}
		
		// If the current website isn't the website containing the marks. return. 
		if (!window.location.href.includes("grades")) return;
		
		// Getting the view-type of the marks as this has an impact on how to get the marks
		// from the website.
		// If the checkbox "overview" isn't checked, return because it isn't supported.
		if (!document.querySelector("div.custom-control>input").checked) return;
		
		
		// Getting all subject divs
		let all_subject_divs = document.querySelectorAll("div.card-body>div");
		
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

			// Getting the config saved in the browser.
			let subject_config = getConfig(subject_title);
			
			let mark_lists = subject_div.querySelectorAll("tr>td");
			let headers = subject_div.querySelectorAll("tr>th");
			
			// Creating the dropdown menus and updating columns.
			let select_states = new Array();
			
			for (let i = 0;i < headers.length-1; i++) {
				let header = headers[i];
				let header_string = cleanString(header.innerText);
				
				// Getting a reference to the select element (creating it if it has to)
				let [select, just_created] = dropdownMenu(header);

				if (!subject_config[header_string]) {
					let val = "0";
					
					// If the header string contains an exam string change the
					// dropdown menu to exam marks (user usability).
					if (checkForExamString(header_string)) {
						val = "1";
					}
					subject_config[header_string] = val;
				}
				
				// Only use the value in the config if the site got reloaded.
				if (just_created) select.value = subject_config[header_string];
				else subject_config[header_string] = select.value;
				// Keeping track of the values for the calculations.
				select_states.push(select.value);
				
				// If the dropdown menu is set to "ignore" make it visible to the user.
				// (column greyed out)
				let style = "";
				if (select.value === "2") {
					style = "color:#A0A0A0 !important";
				}
				
				header.setAttribute("style",style);
				mark_lists[i].setAttribute("style",style);
			}
			
			// Saving every change made to the config
			saveConfig();
			
			// Creating the slider to determine the ratio of exam and others
			// (But only if the subject even has exam marks, if it doesnt, delete slider)
			// "1" is exams in the drop down menu
			let exam_weight = ratioSlider(headers[headers.length-1], !select_states.includes("1"));

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

// To make the interaction really seem flawlessly there has to be an event listener
// on the body and on the card (the div the marks are located in). The update delay on
// body needs to be quite long so that the website has time to load its content. Yet
// if the user clicks on the card the response should come quickly so that it feels
// nice and responive. But if the user clicks on the card, they automatically also
// click on the body. This is why this not elegant solution has to be used at the top
// of updateAverage(delay).
function clickedOnBody() {
	updateAverage(1000);
	let card = document.querySelector("div.card-body");
	
	if (!card) {
		createCardEventListener();
	}
}

function clickedOnCard() {
	updateAverage(10);
}

function createCardEventListener() {
	setTimeout(function() {
		if (window.location.href.includes("grades")) {
			let card = document.querySelector("div.card-body");
			card.addEventListener("click", clickedOnCard);
		}
	}, 1000)
}

// Add click event listeners
document.body.addEventListener("click", clickedOnBody);
createCardEventListener();

// This will be execute after a site loaded.
// This exists for the case that the current site is already the right one and no click has to 
// be made
updateAverage(1500);
