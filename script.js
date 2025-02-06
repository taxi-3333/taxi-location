document.getElementById("randomBtn").addEventListener("click", function() {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/YOUR_SPREADSHEET_ID/values/Sheet1!A1:B1000?key=${CONFIG.API_KEY}`)
        .then(response => response.json())
        .then(data => {
            let rows = data.values;
            let randomIndex1 = Math.floor(Math.random() * rows.length);
            let randomIndex2;
            do {
                randomIndex2 = Math.floor(Math.random() * rows.length);
            } while (randomIndex1 === randomIndex2);
            
            let departureName = rows[randomIndex1][0];
            let departureCoords = rows[randomIndex1][1];
            let arrivalName = rows[randomIndex2][0];
            let arrivalCoords = rows[randomIndex2][1];

            let departureLink = `<a href='https://www.google.com/maps?q=${departureCoords}' target='_blank'>${departureName}</a>`;
            let arrivalLink = `<a href='https://www.google.com/maps?q=${arrivalCoords}' target='_blank'>${arrivalName}</a>`;
            
            document.getElementById("departure").innerHTML = departureLink;
            document.getElementById("arrival").innerHTML = arrivalLink;
            
            document.getElementById("goBtn").onclick = function() {
                window.open(`https://www.google.com/maps/dir/${departureCoords}/${arrivalCoords}/`, '_blank');
            };
        })
        .catch(error => console.error("Error fetching data:", error));
});
