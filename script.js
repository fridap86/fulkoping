// Hämtar formuläret och datumfälten.
const form = document.getElementById("orderForm");
const conferenceDate = document.getElementById("conferenceDate");
const deliveryDate = document.getElementById("deliveryDate");
 
// Hämtar felrutan under respektive datumfält.
const conferenceError = document.getElementById("conferenceDate-error");
const deliveryError = document.getElementById("deliveryDate-error");
 
// Kontrollerar ett datum och visar fel under rätt fält.
function kontrolleraDatum(falt, namn, felruta) {
	let felmeddelande = "";
 
	// Sätter tiden till midnatt för att bara jämföra datum.
	const idag = new Date();
	idag.setHours(0, 0, 0, 0);
 
	if (falt.value === "") {
    	felmeddelande = `${namn} måste fyllas i.`;
	} else {
    	const valtDatum = new Date(`${falt.value}T00:00:00`);
 
    	if (Number.isNaN(valtDatum.getTime()) || valtDatum <= idag) {
        	felmeddelande = `${namn} måste vara senare än idag.`;
    	}
	}
 
	// Visar felet eller tömmer felrutan om datumet är rätt.
	felruta.textContent = felmeddelande;
 
	if (felmeddelande !== "") {
    	falt.setAttribute("aria-invalid", "true");
    	return false;
	}
 
	falt.removeAttribute("aria-invalid");
	return true;
}
// Kontrollerar datumen och att leveransen sker på rätt dag.
function valideraDatum() {
	const conferenceOk = kontrolleraDatum(
    	conferenceDate,
    	"Konferensdatum",
    	conferenceError
	);
 
	const deliveryOk = kontrolleraDatum(
    	deliveryDate,
    	"Leveransdatum",
    	deliveryError
	);
 
	// Jämför bara om båda datumen är giltiga och i framtiden.
	if (!conferenceOk || !deliveryOk) {
    	return false;
	}
 
	const konferensDatum = new Date(
    	`${conferenceDate.value}T00:00:00`
	);
 
	const leveransDatum = new Date(
    	`${deliveryDate.value}T00:00:00`
	);
 
	// Räknar fram dagen före konferensen.
	const dagenFore = new Date(konferensDatum);
	dagenFore.setDate(dagenFore.getDate() - 1);
 
	const sammaDag =
    	leveransDatum.getTime() === konferensDatum.getTime();
 
	const dagenInnan =
    	leveransDatum.getTime() === dagenFore.getTime();
 
	if (!sammaDag && !dagenInnan) {
    	deliveryError.textContent =
        	"Leveransen måste ske på konferensdagen eller dagen före.";
 
    	deliveryDate.setAttribute("aria-invalid", "true");
    	return false;
	}
 
	return true;
}
 
// Kör kontrollen när användaren skickar formuläret.
form.addEventListener("submit", function (event) {
	const datumArGiltiga = valideraDatum();
 
	if (!datumArGiltiga) {
    	// Stoppar formuläret om något datum är fel.
    	event.preventDefault();
 
    	// Flyttar fokus till det första felaktiga datumfältet.
    	if (conferenceDate.getAttribute("aria-invalid") === "true") {
        	conferenceDate.focus();
    	} else {
        	deliveryDate.focus();
    	}
	}
});
