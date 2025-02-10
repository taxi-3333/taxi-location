// ✅ 環境変数を適切に取得
const API_KEY = import.meta.env.VITE_API_KEY || window.API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID || window.SPREADSHEET_ID;
const SHEET_NAME = import.meta.env.VITE_SHEET_NAME || "Sheet1"; // シート名を `.env` から取得

// ✅ 環境変数の確認（デバッグ用）
console.log("API_KEY:", API_KEY);
console.log("SPREADSHEET_ID:", SPREADSHEET_ID);
console.log("SHEET_NAME:", SHEET_NAME);

if (!API_KEY || !SPREADSHEET_ID) {
    alert("設定エラー: APIキー またはスプレッドシートIDが設定されていません。");
    throw new Error("API_KEY または SPREADSHEET_ID が設定されていません。");
}

// ✅ Google Sheets API のエンドポイントを作成
const RANGE = encodeURIComponent(SHEET_NAME); // シート名を環境変数から取得
const URL = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(SPREADSHEET_ID)}/values/${RANGE}?key=${encodeURIComponent(API_KEY)}`;

async function fetchData() {
    try {
        console.log("Fetching data from:", URL);
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }
        const data = await response.json();

        console.log("取得したデータ(JSON):", JSON.stringify(data, null, 2)); // JSON全体を可視化
        if (!data.values) {
            console.error("❌ `values` プロパティが存在しません。スプレッドシートのデータ構造を確認してください。");
            return [];
        }

        return data.values;
    } catch (error) {
        console.error("データの取得中にエラーが発生しました:", error);
        alert(`データの取得に失敗しました。\nエラー内容: ${error.message}`);
        return [];
    }
}

// ✅ ボタン要素の取得
const randomBtn = document.getElementById("randomBtn");
const goBtn = document.getElementById("goBtn");
const navitimeBtn = document.getElementById("navitimeBtn"); // ✅ 追加
const departureElem = document.getElementById("departure");
const arrivalElem = document.getElementById("arrival");

if (!randomBtn || !goBtn || !navitimeBtn || !departureElem || !arrivalElem) {
    console.error("必要なDOM要素が見つかりません。HTMLの構成を確認してください。");
} else {
    let selectedDeparture = "";
    let selectedArrival = "";

    // ✅ ランダムボタンの動作
    randomBtn.addEventListener("click", async () => {
        const data = await fetchData();
        if (!data || data.length === 0) {
            alert("スプレッドシートのデータが空です。");
            return;
        }

        const randomIndex1 = Math.floor(Math.random() * data.length);
        let randomIndex2;
        do {
            randomIndex2 = Math.floor(Math.random() * data.length);
        } while (randomIndex1 === randomIndex2);

        // A列 (0) = 地名, B列 (1) = 緯度経度
        selectedDeparture = data[randomIndex1][1] || "不明"; // 緯度経度
        selectedArrival = data[randomIndex2][1] || "不明"; // 緯度経度

        departureElem.innerText = data[randomIndex1][0] || "不明"; // 地名
        arrivalElem.innerText = data[randomIndex2][0] || "不明"; // 地名

        // ✅ 地名をクリックしたらGoogleマップで検索
        departureElem.setAttribute("data-location", selectedDeparture);
        arrivalElem.setAttribute("data-location", selectedArrival);
    });

    // ✅ 地名クリックで Googleマップを開く
    function openInGoogleMaps(event) {
        const location = event.target.getAttribute("data-location");
        if (!location || location === "不明") {
            alert("位置情報がありません。");
            return;
        }

        // Googleマップで緯度経度を検索
        const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(location)}`;
        window.open(mapUrl, "_blank");
    }

    departureElem.addEventListener("click", openInGoogleMaps);
    arrivalElem.addEventListener("click", openInGoogleMaps);

    // ✅ GOボタンの動作（Googleマップで車のルート検索）
    goBtn.addEventListener("click", () => {
        if (!selectedDeparture || !selectedArrival || selectedDeparture === "不明" || selectedArrival === "不明") {
            alert("出発地または到着地が選択されていません。");
            return;
        }

        // Googleマップのルート検索URL（車でのナビ）
        const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(selectedDeparture)}&destination=${encodeURIComponent(selectedArrival)}&travelmode=driving`;

        // 新しいタブでGoogleマップを開く
        window.open(mapUrl, "_blank");
    });

    // ✅ ナビタイムボタンの動作（iOSアプリを開く）
    navitimeBtn.addEventListener("click", () => {
        console.log("🔹 ナビタイムアプリを開きます...");
        window.open("carnavitime://", "_self"); // ✅ Safariの警告を回避する
    });
}

console.log("✅ Netlify 環境変数チェック");
console.log("VITE_API_KEY:", import.meta.env.VITE_API_KEY);
console.log("VITE_SPREADSHEET_ID:", import.meta.env.VITE_SPREADSHEET_ID);
console.log("VITE_SHEET_NAME:", import.meta.env.VITE_SHEET_NAME);
