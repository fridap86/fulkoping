// Hämtar portionsfälten och rutan för felmeddelanden.
const participants = document.getElementById("participants");
const vegetarian = document.getElementById("vegetarian");
const vegan = document.getElementById("vegan");
const messages = document.getElementById("messages");
 
// Lägger till ett felmeddelande i #messages.
function visaFel(text) {
    const p = document.createElement("p");
    p.textContent = text;
    messages.appendChild(p);
}

function rensaPortionsfel() {
    messages.innerHTML = "";

    [participants, vegetarian, vegan].forEach(falt => {
        falt.removeAttribute("aria-invalid");
    });
}
 
// Del 1: Kontrollerar att ett fält är ett heltal som är 0 eller större.
// Returnerar talet om det är rätt, annars null.
function kontrolleraAntal(falt, namn) {
    const varde = falt.value.trim();
 
    // Om man skriver "5apa" eller "3,5" i ett nummerfält blir value tomt
    // men validity.badInput blir true. Då kan vi skilja på tomt och felaktigt.
    if (falt.validity.badInput) {
        visaFel(`${namn} måste vara ett heltal, t.ex. 5.`);
        falt.setAttribute("aria-invalid", "true");
        return null;
    }
 
    if (varde === "") {
        visaFel(`${namn} måste fyllas i.`);
        falt.setAttribute("aria-invalid", "true");
        return null;
    }
 
    // Godkänner bara siffror. Stoppar "-2", "3.5", "1e3" och liknande.
    if (!/^\d+$/.test(varde)) {
        visaFel(`${namn} måste vara ett heltal som är 0 eller större.`);
        falt.setAttribute("aria-invalid", "true");
        return null;
    }
 
    falt.removeAttribute("aria-invalid");
    return Number(varde);
}
 
// Del 2: Summan av vegetariska och veganska portioner får inte vara
// större än antalet deltagare.
function kontrolleraSumma(antalDeltagare, antalVeg, antalVegan) {
    if (antalVeg + antalVegan !== antalDeltagare) {
        visaFel(
            `Summan av vegetariska och veganska portioner ` +
            `måste vara lika med antalet deltagare (${antalDeltagare}).`
        );

        vegetarian.setAttribute("aria-invalid", "true");
        vegan.setAttribute("aria-invalid", "true");
        return false;
    }

    return true;
}
 
// Kör alla kontroller för portionsfälten.
function valideraPortioner() {
    rensaPortionsfel();

    const antalDeltagare = kontrolleraAntal(participants, "Antal deltagare");
    const antalVeg = kontrolleraAntal(vegetarian, "Antal vegetariska portioner");
    const antalVegan = kontrolleraAntal(vegan, "Antal veganportioner");
 
    // Summan jämförs bara om alla tre fälten är rätt ifyllda.
    if (antalDeltagare === null || antalVeg === null || antalVegan === null) {
        return false;
    }
 
    return kontrolleraSumma(antalDeltagare, antalVeg, antalVegan);
}

// Automatisk validering

[participants, vegetarian, vegan].forEach(falt => {
    falt.addEventListener("input", function () {
        // Kör valideringen när användaren ändrar ett fält.
        valideraPortioner();
    });
});


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

    // Ta bort felmeddelandet och felmarkeringen när datumet är giltigt.
    deliveryError.textContent = "";
    deliveryDate.removeAttribute("aria-invalid");
 
	return true;
}

// Automatisk validering

[conferenceDate, deliveryDate].forEach(falt => {
    falt.addEventListener("change", function () {
        valideraDatum();
    });
});


// Kör alla kontroller när användaren skickar formuläret.
form.addEventListener("submit", function (event) {
    // Stoppa alltid standardbeteendet tills valideringen är klar.
    event.preventDefault();

    const portionerOk = valideraPortioner();
    const datumOk = valideraDatum();

    if (!portionerOk || !datumOk) {
        const forstaFel = form.querySelector('[aria-invalid="true"]');

        if (forstaFel) {
            forstaFel.focus();
        }

        return;
    }

    // Alla kontroller är godkända.
    // Här kan en bekräftelse visas eller funktion för att skicka beställningen.
});