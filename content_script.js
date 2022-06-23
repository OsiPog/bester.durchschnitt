function updateAverage() {
	setTimeout(function() {
		// Getting all subject divs
		let all_subject_divs = document.querySelectorAll("div.card-body>div");
		console.log(all_subject_divs);
		for (let subject_div of all_subject_divs) {
			
			if (subject_div.querySelector("p")) continue; // This <p> element will only be present if the subject has no marks yet.

			let subject_label = subject_div.querySelector("h2");
			let mark_type_td_list = subject_div.querySelectorAll("tr>td");
			console.log(mark_type_td_list);
			
			let average = 0;
			// Only going through the first two because there should be only two types of marks (exam, others).
			let len = Math.min(2, mark_type_td_list.length-1);
			for (let i=0;i<len;i++) {
				let half_average = 0;
				let marks = mark_type_td_list[i].querySelectorAll("div>span");
				console.log(marks);
				for (let mark of marks) {
					console.log(mark);
					half_average += parseInt(mark.innerHTML);
				}
				half_average /= marks.length;

				average += half_average;
			}
			average = (average/len).toFixed(2); // Rounding up so that a periodic decimal doesn't litter the screen.
			
			let average_span = subject_label.querySelector("span[bs-durchschnitt]"); 
			if (!average_span) {
				average_span = document.createElement("span");
				subject_label.appendChild(average_span);
				average_span.setAttribute("bs-durchschnitt", "");
			}
			average_span.innerHTML = "∅" + average;
		}
	}, 1000);
}

function clickedOnNoten() {
	// Now that the page with all marks in opened the averages have to be updated
	updateAverage();
	
	all_halfyear_links = document.querySelectorAll("div.card-body>nav>a");
	for (let halfyear_link of all_halfyear_links) {
		halfyear_link.addEventListener("click", updateAverage);
	}
	console.log("Clicked on 'Noten'");
}

function findNotenLink() {
	// Finding the link which will bring the user to site with all marks displayed
	// The script is assuming that it is only executed on the right site (set in the manifest)
	let all_nav_links = document.querySelectorAll("li.nav-item>a");
	let noten_link;
	for (let nav_link of all_nav_links) {
		if (nav_link.innerHTML.includes("Noten")) {
			noten_link = nav_link;
			break;
		}
	}
	console.log(noten_link);
	noten_link.addEventListener("click", clickedOnNoten);
}


// The timeouts are set because the site has an internal loader which has to be given time.
setTimeout(findNotenLink, 500);

// For the case that the user is already on the right site
if (window.location.href.includes("grades")) { 
	setTimeout(clickedOnNoten, 500);
}

