document.getElementById("randomBtn").addEventListener("click", fetchRandomLocation);
document.getElementById("goBtn").addEventListener("click", goToLocation);

const API_KEY = ""; // Netlify環境変数から取得
const SPREADSHEET_ID = ""; // Netlify環境変数から取得
const RANGE = ""; // 空欄にすることで全データを取得

async function fetchSheetData() {
    if (!API_KEY || !SPREADSHEET_ID) {
        console.error("API_KEY または SPREADSHEET_ID が設定されていません。");
        alert("設定エラー: APIキーまたはスプレッドシートIDが設定されていません。");
        return null;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTPエラー: ${response.status}`);
        const data = await response.json();

        if (!data.values || data.values.length === 0) {
            throw new Error("スプレッドシートにデータがありません。");
        }
        return data.values;
    } catch (error) {
        console.error("データの取得中にエラーが発生しました:", error);
        alert("データの取得に失敗しました。設定を確認してください。");
        return null;
    }
}

async function fetchRandomLocation() {
    const data = await fetchSheetData();
    if (!data) return;

    const randomIndex = Math.floor(Math.random() * data.length);
    const [place, lat, lng] = data[randomIndex];

    document.getElementById("departure").textContent = place || "不明";
    document.getElementById("departure").href = `https://www.google.com/maps?q=${lat},${lng}`;
}

async function goToLocation() {
    const departure = document.getElementById("departure").href;
    if (!departure || departure === "#") {
        alert("出発地が選択されていません。");
        return;
    }
    window.open(departure, "_blank");
}
