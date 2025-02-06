document.getElementById("randomBtn").addEventListener("click", function () {
    fetch("https://sheets.googleapis.com/v4/spreadsheets/YOUR_SPREADSHEET_ID/values/シート1!A1:Z1000?key=YOUR_API_KEY")
        .then(response => response.json())
        .then(data => {
            let rows = data.values;
            let randomIndex1 = Math.floor(Math.random() * (rows.length - 1)) + 1;
            let randomIndex2;
            do {
                randomIndex2 = Math.floor(Math.random() * (rows.length - 1)) + 1;
            } while (randomIndex1 === randomIndex2);

            let departure = rows[randomIndex1][0]; // 出発地名
            let arrival = rows[randomIndex2][0]; // 到着地名

            let departureElement = document.getElementById("departure");
            let arrivalElement = document.getElementById("arrival");

            departureElement.innerHTML = `<a href="https://www.google.com/maps/search/?q=${encodeURIComponent(departure)}" target="_blank">${departure}</a>`;
            arrivalElement.innerHTML = `<a href="https://www.google.com/maps/search/?q=${encodeURIComponent(arrival)}" target="_blank">${arrival}</a>`;
        })
        .catch(error => console.error("Error fetching data:", error));
});
