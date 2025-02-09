// ✅ 環境変数を `window` から取得
const API_KEY = window.API_KEY;
const SPREADSHEET_ID = window.SPREADSHEET_ID;

// ✅ 環境変数の確認（デバッグ用）
console.log("API_KEY:", API_KEY);
console.log("SPREADSHEET_ID:", SPREADSHEET_ID);

if (!API_KEY || !SPREADSHEET_ID) {
    alert("設定エラー: APIキー またはスプレッドシートIDが設定されていません。");
    throw new Error("API_KEY または SPREADSHEET_ID が設定されていません。");
}

// ✅ Google Sheets API のエンドポイントを作成
const RANGE = "Sheet1"; // 取得する範囲を指定
const URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

async function fetchData() {
    try {
        console.log("Fetching data from:", URL); // デバッグ用ログ
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

// ✅ ランダムボタンの動作
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

// ✅ GOボタンの動作
document.getElementById("goBtn").addEventListener("click", () => {
    alert("目的地に向かいます！");
});
