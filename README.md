[Deutsche Version dieser Seite](https://github.com/OsiPog/bester.durchschnitt-browser-addon/blob/master/README_DE.md)

### This add-on is discontinued. An app with the same features is currently being developed: https://github.com/OsiPog/bester.durchschnitt-app



# bester.durchschnitt (Browser Add-On)

**A browser add-on for https://beste.schule/**

*This add-on is not official and does not stand in direct contact to Schulverwalter*

![](https://i.imgur.com/ddw5TrS.png)

## Table of Contents

1. [Installation](#Installation)
2. [About](#About)
   - [Features](#Features)
   
   - [Missing Features](#Missing-Features)
   
   - [Known Bugs](#Known-Bugs)
3. [Special Thanks](#Special-Thanks)

## Installation

The add-on is tested on Firefox and Chromium-based browsers.

- **Firefox:** https://github.com/OsiPog/bester.durchschnitt/releases/download/1.3.2/bester-durchschnitt-firefox.xpi
- **Chromium:** https://chrome.google.com/webstore/detail/besterdurchschnitt/fgodlbapghefmkgcciefhogiedgjdpli

## About

This add-on calculates and displays the averages of every subject on the "grades"-page of https://beste.schule/. Additionally it calculates the overall average for the whole term with the rounded averages of the subjects. The view-type "Details" is not supported.

The averages are calculated as followed:

$$
\text{Average} = \frac{\text{Exam: Weight} * \frac{\text{Exam: Sum}}{\text{Exam: Count}} + \text{Other: Weight} * \frac{\text{Other: Sum}}{\text{Other: Count}}}{100}
$$


#### Features

- Average for every subject
- Overall average for the whole term
- Selection for every mark-type: **"Exam", "Other"** or **"ignore"**
  - The add-on automatically recognizes which column should be in the category "Exam" (If this isn't the case send me an email: osibluber@protonmail.com or open an issue here)
- custom weighting for every subject
- Auto-save of settings (mark-type, weights)



#### Missing Features

- Option to choose if the average is being rounded up or down on "*.5*" (Is only important while calculating the overall average)
- Button to reset all Settings
- temporary adding/removing of marks to see how the average changes



#### Known Bugs

- Settings stay the same even though another term got selected
- While ignoring all marks of a subject an average of 0.00 is created which messes up the overall average

## Special Thanks

- :heart: Thanks to **Iqel** for lending me his beste.schule Account because it had way more edge cases than mine.

