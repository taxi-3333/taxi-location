document.getElementById("randomBtn").addEventListener("click", function () {
    fetch("https://sheets.googleapis.com/v4/spreadsheets/13wSYoIMz0024aPeg5Kv7ix2LqbnN_6emfrkBj6BQky4/values/Sheet1?key=AIzaSyA3pbjX3uPYHzSwiGUPBL8tT-A9vDimuVA")

        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.values || data.values.length === 0) {
                throw new Error("No data found in the spreadsheet.");
            }

            let rows = data.values;
            let randomIndex1 = Math.floor(Math.random() * (rows.length - 1)) + 1;
            let randomIndex2;
            do {
                randomIndex2 = Math.floor(Math.random() * (rows.length - 1)) + 1;
            } while (randomIndex1 === randomIndex2);

            let departure = rows[randomIndex1][0];
            let departureCoords = rows[randomIndex1][1];
            let arrival = rows[randomIndex2][0];
            let arrivalCoords = rows[randomIndex2][1];

            document.getElementById("departure").innerHTML = `<a href="https://www.google.com/maps/place/${departureCoords}" target="_blank" rel="noopener noreferrer">${departure}</a>`;
            document.getElementById("arrival").innerHTML = `<a href="https://www.google.com/maps/place/${arrivalCoords}" target="_blank" rel="noopener noreferrer">${arrival}</a>`;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("データの取得に失敗しました。APIキーやスプレッドシートIDを確認してください。");
        });
});
