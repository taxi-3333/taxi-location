const SPREADSHEET_ID = "13wSYoIMz0024aPeg5Kv7ix2LqbnN_6emfrkBj6BQky4"; // あなたのスプレッドシートID
const API_KEY = "YOUR_GOOGLE_SHEETS_API_KEY"; // あなたのAPIキー

const RANGE = "";  // シート全体を取得

const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

async function fetchData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("取得したデータ:", data);

        if (data.values && data.values.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.values.length);
            const [departure, arrival] = data.values[randomIndex];

            document.getElementById("departure").textContent = departure || "出発地なし";
            document.getElementById("arrival").textContent = arrival || "到着地なし";
        } else {
            console.error("スプレッドシートにデータがありません");
        }
    } catch (error) {
        console.error("データの取得中にエラーが発生しました:", error);
    }
}

document.getElementById("randomBtn").addEventListener("click", fetchData);
