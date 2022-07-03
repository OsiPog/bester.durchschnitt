function textSpan(parent_element, average) {
	let average_span = parent_element.querySelector("span[bs-durchschnitt-average]"); 
	if (!average_span) {
		average_span = document.createElement("span");
		average_span.setAttribute("bs-durchschnitt-average", "");
		
		parent_element.appendChild(average_span);
	}
	if (!Number.isNaN(average)) {
		average_span.innerText = "∅" + average.toFixed(2);
	}
	else {
		parent_element.removeChild(average_span);
	}
}

function dropdownMenu(header, mark_list, select_states) {
	let select = header.querySelector("select[bs-durchschnitt-dropdown]");
	if (!select) {
		select = document.createElement("select");
		select.setAttribute("bs-durchschnitt-dropdown","");
		
		select.setAttribute("name", "mark-type");
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
		if (checkForExamString(header.innerHTML)) {
			select.value = "1";
		}
		
		header.innerHTML += "<br>"; // Using innerHTML because <br> is an HTML tag.
		header.appendChild(select);
	}
	
	// Keeping track of the values for the calculations.
	select_states.push(select.value);
	
	// If the dropdown menu is set to "ignore" make it visible to the user.
	// (column greyed out)
	let style = "";
	if (select.value === "2") {
		style = "color:#A0A0A0 !important";
	}
	
	header.setAttribute("style",style);
	mark_list.setAttribute("style",style);
}

function ratioSlider(empty_header, remove_slider = false) {
	let slider = empty_header.querySelector("input[bs-durchschnitt-slider]");
	let span = empty_header.querySelector("span[bs-durchschnitt-slider-span]");
	
	if (!slider) {
		span = document.createElement("span");
		span.setAttribute("bs-durchschnitt-slider-span", "");
		
		span.setAttribute("style", "float:right;font-size:0.9em");
		
		empty_header.appendChild(span);
		
		
		slider = document.createElement("input");
		slider.setAttribute("bs-durchschnitt-slider", "");
		
		slider.setAttribute("type", "range");
		slider.setAttribute("min", "0");
		slider.setAttribute("max", "100");
		slider.setAttribute("step", "10");
		slider.setAttribute("value", "50");
		slider.setAttribute("style", "float:right;width:6em;margin-right:0.5em");
		
		empty_header.appendChild(slider);
	}
	
	if (remove_slider) {
		empty_header.removeChild(slider);
		empty_header.removeChild(span);
		
		return 0; // Exam weight is 0 when there are no exams
	}
	
	span.innerText = "KA/LK → " + slider.value + "/" + (100-slider.value);
	
	return Number(slider.value);
}