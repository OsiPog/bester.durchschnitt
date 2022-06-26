// This is not a very elegant way to figure out if a column is for exam marks but as
// I don't have an API nor does the Website provide any information about it I have to
// do it like this.
let EXAM_STRINGS = ["KL", "Klausur", "KA", "Kl", "Klassenarbeit", "Ka"];

let SELECT_OPTIONS = ["Sonstige", "KA/Klausur", "ignorieren"];

let _last_quick_update = 0;

function round(num, digits=0) {
	return Math.round(num * 10 ** digits)/(10 ** digits);
}

function checkForExamString(string) {
	for (let exam_string of EXAM_STRINGS) {
		if (string.includes(exam_string)) return true;
	}
	return false;
}

function updateAverage(delay) {
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
		
		
		// Getting the view-type of the marks as this has an impact on how to get the marks
		// from the website.

		// If the checkbox "overview" isn't checked, return because it isn't supported.
		if (!document.querySelector("div.custom-control>input").checked) return;
		
		// Getting all subject divs
		let all_subject_divs = document.querySelectorAll("div.card-body>div");
		
		let overall_average = 0;
		let overall_av_len = 0;
		
		for (let subject_div of all_subject_divs) {
			
			// This <p> element will only be present if the subject has no marks yet.
			if (subject_div.querySelector("p")) continue; 

			let subject_label = subject_div.querySelector("h2");
			console.log(subject_label.innerHTML);
	
			let mark_lists = subject_div.querySelectorAll("tr>td");
			let headers = subject_div.querySelectorAll("tr>th");
			
			// Creating the dropdown menus and updating columns.
			let select_states = new Array();
			
			for (let i = 0;i < headers.length-1; i++) {
				let select = headers[i].querySelector("select[bs-durchschnitt]");
				if (!select) {
					select = document.createElement("select");
					select.setAttribute("name", "mark-type");
					select.setAttribute("bs-durchschnitt","");
					select.setAttribute("style", "font-size:0.85em");
					
					// "0" - "other marks"
					// "1" - "exam marks"
					// "2" - "ignore"
					for(let i = 0;i < SELECT_OPTIONS.length; i++) {
						let opt = document.createElement("option");
						opt.setAttribute("value", String(i));
						opt.innerHTML = SELECT_OPTIONS[i];
						select.appendChild(opt);
					}
					
					// If the header string contains an exam string change the
					// dropdown menu to exam marks (user usability).
					if (checkForExamString(headers[i].innerHTML)) {
						select.value = "1";
					}
					
					headers[i].innerHTML += "<br>";
					headers[i].appendChild(select);
				}
				
				// Keeping track of the values for the calculations.
				select_states.push(select.value);
				
				// If the dropdown menu is set to "ignore" make it visible to the user.
				// (column greyed out)
				let style = "";
				if (select.value === "2") {
					style = "color:#A0A0A0 !important";
				}
				
				headers[i].setAttribute("style",style);
				mark_lists[i].setAttribute("style",style);
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
				average += average_others;
			}
			if (exams_amount !== 0) {
				average_exams /= exams_amount;
				average += average_exams;
			}
			
			average /= (others_amount !== 0) + (exams_amount !== 0); // true = 1, false = 0
			
			let average_span = subject_label.querySelector("span[bs-durchschnitt]"); 
			if (!average_span) {
				average_span = document.createElement("span");
				subject_label.appendChild(average_span);
				average_span.setAttribute("bs-durchschnitt", "");
			}
			
			if (!Number.isNaN(average)) {
				average_span.innerHTML = "∅" + average.toFixed(2);
				overall_average += round(average);
				overall_av_len++;
			}
			else {
				subject_label.removeChild(average_span);
			}
		}
		
		// putting the overall average next to the half year text
		overall_average = overall_average/overall_av_len;
		
		let halfyear_selected = document.querySelector("nav>a.active");
		
		let overall_average_span = halfyear_selected.querySelector("span[bs-durchschnitt]"); 
		if (!overall_average_span) {
			overall_average_span = document.createElement("span");
			halfyear_selected.appendChild(overall_average_span);
			overall_average_span.setAttribute("bs-durchschnitt", "");
		}
		if (!Number.isNaN(overall_average)) {
			overall_average_span.innerHTML = "∅" + overall_average.toFixed(2);
		} else {
			halfyear_selected.removeChild(overall_average_span);
		}
		
	}, delay);
}
function clicked(delay = 0) {
	if (window.location.href.includes("grades")) { 
		updateAverage(delay);
	}
}

// To make the interaction really seem flawlessly there has to be an event listener
// on the body and on the card (the div the marks are located in). The update delay on
// body needs to be quite long so that the website has time to load its content. Yet
// if the user clicks on the card the response should come quickly so that it feels
// nice and responive. But if the user clicks on the card, they automatically also
// click on the body. This is why this not elegant solution has to be used at the top
// of updateAverage(delay).
function clickedOnBody() {
	clicked(1000);
}

function clickedOnCard() {
	clicked(10);
}

function createEventListeners() {
	document.body.addEventListener("click", clickedOnBody);
	
	// Delaying this so that the site has time to load the mark view
	setTimeout(function() {
		if (window.location.href.includes("grades")) { 
			let card = document.querySelector("div.card-body");
			card.addEventListener("click", clickedOnCard);
		}
	}, 1000);

}

// Add click event listeners
createEventListeners();

// This will be execute after a site loaded.
// This exists for the case that the current site is already the right one and no click has to 
// be made
clicked(1500);