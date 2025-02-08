const API_KEY = import.meta.env.VITE_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const RANGE = "";

if (!API_KEY || !SPREADSHEET_ID) {
    alert("設定エラー: APIキーまたはスプレッドシートIDが設定されていません。");
    throw new Error("API_KEY または SPREADSHEET_ID が設定されていません。");
}

const SHEETS_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

async function fetchData() {
    try {
        const response = await fetch(SHEETS_URL);
        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }
        const data = await response.json();
        console.log("取得したデータ:", data);
        processData(data);
    } catch (error) {
        console.error("データの取得中にエラーが発生しました:", error);
    }
}

function processData(data) {
    if (!data.values || data.values.length === 0) {
        console.warn("スプレッドシートにデータがありません。");
        return;
    }

    const values = data.values;
    console.log("処理するデータ:", values);

    const randomIndex = Math.floor(Math.random() * values.length);
    const selectedRow = values[randomIndex];

    if (selectedRow.length >= 2) {
        document.getElementById("departure").textContent = selectedRow[0];
        document.getElementById("destination").textContent = selectedRow[1];
    } else {
        console.warn("データのフォーマットが不正です:", selectedRow);
    }
}

document.getElementById("random-btn").addEventListener("click", fetchData);
