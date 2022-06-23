function onRightURL() {
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
			subject_label.innerHTML += "∅" + average;
		}
	}, 1500);
}

function checkRightURL() {
		
	let current_url = window.location.href;

	let right_url = (current_url.includes("https://beste.schule") && current_url.includes("grades"))
	console.log(right_url);
	if (right_url) onRightURL();
}

setTimeout(checkRightURL, 0);


