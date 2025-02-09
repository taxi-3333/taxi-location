// ✅ 環境変数を適切に取得
const API_KEY = import.meta.env.VITE_API_KEY || window.API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID || window.SPREADSHEET_ID;

// ✅ 環境変数の確認（デバッグ用）
console.log("API_KEY:", API_KEY);
console.log("SPREADSHEET_ID:", SPREADSHEET_ID);

if (!API_KEY || !SPREADSHEET_ID) {
    alert("設定エラー: APIキー またはスプレッドシートIDが設定されていません。");
    throw new Error("API_KEY または SPREADSHEET_ID が設定されていません。");
}

// ✅ Google Sheets API のエンドポイントを作成
const RANGE = encodeURIComponent("Sheet1"); // 取得する範囲を指定（エンコード）
const URL = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(SPREADSHEET_ID)}/values/${RANGE}?key=${encodeURIComponent(API_KEY)}`;

async function fetchData() {
    try {
        console.log("Fetching data from:", URL); // デバッグ用ログ
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }
        const data = await response.json();
        console.log("取得したデータ:", data);
        return data.values || [];
    } catch (error) {
        console.error("データの取得中にエラーが発生しました:", error);
        alert(`データの取得に失敗しました。\nエラー内容: ${error.message}`);
        return [];
    }
}

// ✅ ボタン要素の取得とエラーハンドリング
const randomBtn = document.getElementById("randomBtn");
const goBtn = document.getElementById("goBtn");
const departureElem = document.getElementById("departure");
const arrivalElem = document.getElementById("arrival");

if (!randomBtn || !goBtn || !departureElem || !arrivalElem) {
    console.error("必要なDOM要素が見つかりません。HTMLの構成を確認してください。");
} else {
    // ✅ ランダムボタンの動作
    randomBtn.addEventListener("click", async () => {
        const data = await fetchData();
        if (!data || data.length === 0) {
            alert("スプレッドシートのデータが空です。");
            return;
        }

        if (data.length === 1) {
            departureElem.innerText = data[0][0] || "不明";
            arrivalElem.innerText = "（データ不足）";
            return;
        }

        const randomIndex1 = Math.floor(Math.random() * data.length);
        let randomIndex2;
        do {
            randomIndex2 = Math.floor(Math.random() * data.length);
        } while (randomIndex1 === randomIndex2 && data.length > 1);

        departureElem.innerText = data[randomIndex1][0] || "不明";
        arrivalElem.innerText = data[randomIndex2][0] || "不明";
    });

    // ✅ GOボタンの動作
    goBtn.addEventListener("click", () => {
        alert("目的地に向かいます！");
    });
}
