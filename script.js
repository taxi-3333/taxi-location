document.getElementById("randomBtn").addEventListener("click", function () {
    fetch("https://sheets.googleapis.com/v4/spreadsheets/YOUR_SPREADSHEET_ID/values/Sheet1!A1:Z1000?key=YOUR_API_KEY")
        .then(response => response.json())
        .then(data => {
            let rows = data.values;

            // ランダムに2つの異なるインデックスを選ぶ
            let randomIndex1 = Math.floor(Math.random() * (rows.length - 1)) + 1;
            let randomIndex2;
            do {
                randomIndex2 = Math.floor(Math.random() * (rows.length - 1)) + 1;
            } while (randomIndex1 === randomIndex2);

            // 出発地点のデータ
            let departureName = rows[randomIndex1][0]; // A列（地名）
            let departureLatLng = rows[randomIndex1][1]; // B列（緯度,経度）

            // 到着地点のデータ
            let arrivalName = rows[randomIndex2][0]; // A列（地名）
            let arrivalLatLng = rows[randomIndex2][1]; // B列（緯度,経度）

            // HTML要素にセット（Googleマップリンク付き）
            let departureElem = document.getElementById("departure");
            departureElem.textContent = departureName;
            departureElem.href = `https://www.google.com/maps/place/${departureLatLng}`;

            let arrivalElem = document.getElementById("arrival");
            arrivalElem.textContent = arrivalName;
            arrivalElem.href = `https://www.google.com/maps/place/${arrivalLatLng}`;
        })
        .catch(error => console.error("Error fetching data:", error));
});
