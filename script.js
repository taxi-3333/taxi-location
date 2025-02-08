// Netlify の環境変数を取得
const API_KEY = import.meta.env.VITE_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;

// 環境変数の確認
console.log("VITE_API_KEY:", API_KEY);
console.log("VITE_SPREADSHEET_ID:", SPREADSHEET_ID);

if (!API_KEY || !SPREADSHEET_ID) {
    alert("設定エラー: APIキー またはスプレッドシートIDが設定されていません。");
    throw new Error("API_KEY または SPREADSHEET_ID が設定されていません。");
}

// Google Sheets API のエンドポイントを作成
const RANGE = "Sheet1"; // シート名を指定
const URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

async function fetchData() {
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }
        const data = await response.json();
        console.log("取得したデータ:", data);
        return data.values;
    } catch (error) {
        console.error("データの取得中にエラーが発生しました:", error);
        alert("データの取得に失敗しました。");
    }
}

document.getElementById("randomBtn").addEventListener("click", async () => {
    const data = await fetchData();
    if (!data || data.length === 0) return;

    const randomIndex1 = Math.floor(Math.random() * data.length);
    let randomIndex2;
    do {
        randomIndex2 = Math.floor(Math.random() * data.length);
    } while (randomIndex1 === randomIndex2);

    document.getElementById("departure").innerText = data[randomIndex1][0] || "不明";
    document.getElementById("arrival").innerText = data[randomIndex2][0] || "不明";
});

document.getElementById("goBtn").addEventListener("click", () => {
    alert("目的地に向かいます！");
});
