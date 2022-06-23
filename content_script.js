function round(num, digits=0) {
	return Math.round(num * 10 ** digits)/(10 ** digits);
}

function updateAverage() {
	// The timeout is set because the site has an internal loader.
	setTimeout(function() {
		// Getting the view-type of the marks as this has an impact on how to get the marks
		// from the website.

		// This is the checkbox radio element for the view type "overview".
		let overview = document.querySelector("div.custom-control>input").checked;
		
		// Temporarily until the view type "Details" is finished
		if (!overview) return;
		
		// Getting all subject divs
		let all_subject_divs = document.querySelectorAll("div.card-body>div");
		
		let overall_average = 0;
		let overall_av_len = 0;
		
		for (let subject_div of all_subject_divs) {
			
			// This <p> element will only be present if the subject has no marks yet.
			if (subject_div.querySelector("p")) continue; 

			let subject_label = subject_div.querySelector("h2");
			
			let mark_type_list = subject_div.querySelectorAll("tr>td");
			
			let average = 0;
			
			// Only going through the first two because there should be only two types of 
			// marks (exam, others).
			let len = Math.min(2, mark_type_list.length-1);
			for (let i=0;i<len;i++) {
				let half_average = 0;

				let marks = mark_type_list[i].querySelectorAll("div>span");
				
				for (let mark of marks) {
					
					half_average += parseInt(mark.innerHTML);
				}
				half_average /= marks.length;

				average += half_average;
			}
			average /= len;
			
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