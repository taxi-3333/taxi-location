document.getElementById("randomBtn").addEventListener("click", function () {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/YOUR_SPREADSHEET_ID/values/Sheet1!A1:Z1000?key=${API_KEY}`)

        .then(response => response.json())
        .then(data => {
            let rows = data.values;
            let randomIndex1 = Math.floor(Math.random() * (rows.length - 1)) + 1;
            let randomIndex2;
            do {
                randomIndex2 = Math.floor(Math.random() * (rows.length - 1)) + 1;
            } while (randomIndex1 === randomIndex2);

            let departureName = rows[randomIndex1][0];
            let departureCoords = rows[randomIndex1][1];
            let arrivalName = rows[randomIndex2][0];
            let arrivalCoords = rows[randomIndex2][1];

            let departureLink = `https://www.google.com/maps?q=${departureCoords}`;
            let arrivalLink = `https://www.google.com/maps?q=${arrivalCoords}`;

            let departureElem = document.getElementById("departure");
            let arrivalElem = document.getElementById("arrival");

            departureElem.textContent = departureName;
            departureElem.href = departureLink;

            arrivalElem.textContent = arrivalName;
            arrivalElem.href = arrivalLink;

            // GO!ボタンにルート検索のリンクを設定
            document.getElementById("goBtn").onclick = function () {
                let routeUrl = `https://www.google.com/maps/dir/?api=1&origin=${departureCoords}&destination=${arrivalCoords}&travelmode=driving`;
                window.open(routeUrl, "_blank");
            };
        })
        .catch(error => console.error("Error fetching data:", error));
});
