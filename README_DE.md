### Dieses Add-On wird nicht mehr weiterentwickelt, eine App mit den gleichen Funktionen befindet sich in Entwicklung: https://github.com/OsiPog/bester.durchschnitt



# bester.durchschnitt (Browser Add-On)

**Ein Browser Add-On für https://beste.schule/**

*Dieses Add-On ist nicht offiziell und steht in keinem direkten Kontakt zu Schulverwalter.*

![](https://i.imgur.com/ddw5TrS.png)

## Inhalt

1. [Installation](#Installation)
2. [Über das Add-On](#Über-das-Add-On)
   - [Funktionen](#Funktionen)
   
   - [Fehlende Funktionen](#Fehlende-Funktionen)
   
   - [Bekannte Bugs](#Bekannte-Bugs)
3. [Dankesagungen](#Dankesagungen)

## Installation

Das Add-On wurde in Firefox und Chromium-basierenden Browsern getestet.

- **Firefox:** https://github.com/OsiPog/bester.durchschnitt/releases/download/1.3.2/bester-durchschnitt-firefox.xpi
- **Chromium:** https://chrome.google.com/webstore/detail/besterdurchschnitt/fgodlbapghefmkgcciefhogiedgjdpli

## Über das Add-On

Dieses Add-On berechnet und zeigt den Durchschnitt jedes Faches auf der Notenseite von https://beste.schule/ an. Es berechnet außerdem noch den Gesamtdurchschnitt des Halbjahres mit den gerundeten Zeugnisnoten der einzelnen Fächer. Leider wird die Ansichtsmethode "Details" nicht unterstützt.

Die Durchschnitte werden wie folgt ausgerechnet:
$$ \text{Durchschnitt} = {{\text{KA/Klausur: Wichtung} * {{\text{KA/Klausur: Summe}}\over{\text{KA/Klausur: Anzahl}}} + \text{Sonstige: Wichtung} * {{\text{Sonstige: Summe}}\over\text{Sonstige: Anzahl}}}\over{100}} $$

#### Funktionen

- Durchschnitt für jedes Fach
- Gesamtdurchschnitt eines Halbjahres
- Auswahl für jede Notenspalte: **Klassenarbeit/Klausur**, **Sonstige Note** oder **ignorieren**
  - Es wird automatisch erkannt, was eine KA/Klausur ist. Falls das nicht der Fall ist, lasst es mich wissen (Schreibt mir eine Email: osibluber@protonmail.com oder öffnet hier ein Issue)
- benutzerdefinierte Auswahl der Wichtungen für jedes Fach
- Automatisches Speichern der benutzerdefinierten Einstellungen (Auswahl der Notenart, Wichtungen)



#### Fehlende Funktionen

- Auswahl ob bei "Komma 5" mathematisch auf- oder abgerundet werden soll (Ist nur wichtig beim Ausrechnen des Halbjahresdurchschnitts)
- Button zum zurücksetzen der Einstellungen
- temporäres hinzufügen und entfernen von Noten um zu sehen, wie sich der Durchschnitt ändert



#### Bekannte Bugs

- Einstellungen bleiben zum Teil die selben, obwohl Halbjahr gewechselt wurde
- Beim Ignorieren aller Noten in einem Fach entsteht ein Durchschnitt von 0.00, was den Gesamtdurchschnitt verfälscht

## Dankesagungen

- :heart: Danke an **Iqel** für die Bereitstellung seines beste.schule Accounts, da dieser viel mehr Edge-cases geboten hatte als mein eigener.

