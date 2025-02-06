document.getElementById("randomBtn").addEventListener("click", function() {
    fetch("https://sheets.googleapis.com/v4/spreadsheets/13wSYoIMz0024aPeg5Kv7ix2LqbnN_6emfrkBj6BQky4
/values/シート1?key=AIzaSyA3pbjX3uPYHzSwiGUPBL8tT-A9vDimuVA")
    .then(response => response.json())
    .then(data => {
        let rows = data.values;
        let randomIndex1 = Math.floor(Math.random() * (rows.length - 1)) + 1;
        let randomIndex2;
        do {
            randomIndex2 = Math.floor(Math.random() * (rows.length - 1)) + 1;
        } while (randomIndex1 === randomIndex2);

        document.getElementById("departure").textContent = rows[randomIndex1][0];
        document.getElementById("arrival").textContent = rows[randomIndex2][0];
    })
    .catch(error => console.error("Error fetching data:", error));
});
