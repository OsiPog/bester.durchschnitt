// This is not a very elegant way to figure out if a column is for exam marks but as
// I don't have an API nor does the Website provide any information about it.
let EXAM_STRINGS = ["KL", "Klausur", "KA", "Kl", "Klassenarbeit"];

function round(num, digits=0) {
	return Math.round(num * 10 ** digits)/(10 ** digits);
}

function checkForExamString(string) {
	for (let exam_string of EXAM_STRINGS) {
		if (string.includes(exam_string)) return true;
	}
	return false;
}

function updateAverage() {
	// The timeout is set because the site has an internal loader.
	setTimeout(function() {
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
			let headers = subject_div.querySelectorAll("tr>th");
			let mark_lists = subject_div.querySelectorAll("tr>td");
			
			createCheckboxes();

			let average_exams = 0;
			let exams_amount = 0;
			
			let average_others = 0;
			let others_amount = 0;
			
			
			for (let i = 0;i < headers.length-1; i++) { // The last column is empty
				
				let mark_elements = mark_lists[i].querySelectorAll("div>span");
				
				let is_exams = checkForExamString(headers[i].innerHTML);
				
				console.log(i);
				console.log(is_exams);
				
				for (let mark_element of mark_elements) {
					let mark = Number(mark_element.innerHTML)
					
					// Sometimes tests which haven't been attended are marked as "-".
					if (Number.isNaN(mark)) continue;
					
					if (is_exams) {
						average_exams += mark;
						exams_amount++;
					}
					else {
						average_others += mark;
						others_amount++;
					}
				}
			}
			let average;
			
			average_others /= others_amount;
			if (exams_amount !== 0) {
				average_exams /= exams_amount;
				average = (average_exams + average_others)/2
			}
			else {
				average = average_others;
			}
			
			let average_span = subject_label.querySelector("span[bs-durchschnitt]"); 
			if (!average_span) {
				average_span = document.createElement("span");
				subject_label.appendChild(average_span);
				average_span.setAttribute("bs-durchschnitt", "");
			}
			average_span.innerHTML = "∅" + average.toFixed(2);
			
			overall_av_len += 1;
			overall_average += round(average); 
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
		overall_average_span.innerHTML = "∅" + overall_average.toFixed(2);
	}, 750);
}

function clickedOnBody() {
	if (window.location.href.includes("grades")) { 
		updateAverage();
	}
}



document.body.addEventListener("click", clickedOnBody);

// This will be execute after a site loaded.
// It exists for the case that the current site is already the right one and now click has to 
// be made
clickedOnBody();