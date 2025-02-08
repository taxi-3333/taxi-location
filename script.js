// 環境変数の確認
console.log("VITE_API_KEY:", import.meta.env.VITE_API_KEY);
console.log("VITE_SPREADSHEET_ID:", import.meta.env.VITE_SPREADSHEET_ID);

// Google Sheets API の設定
const API_KEY = import.meta.env.VITE_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const RANGE = "";  // シート全体を取得

// API URL の作成
const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

async function fetchData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTPエラー！ステータス: ${response.status}`);
        }
        const data = await response.json();
        console.log("取得したデータ:", data);

        if (!data.values || data.values.length === 0) {
            throw new Error("スプレッドシートのデータが空です");
        }

        processSheetData(data.values);
    } catch (error) {
        console.error("データの取得中にエラーが発生しました:", error);
        alert(`データ取得エラー: ${error.message}`);
    }
}

function processSheetData(values) {
    // ここでスプレッドシートのデータを処理する
    console.log("処理するデータ:", values);
}

// ボタンのイベントリスナー
document.getElementById("fetch-button").addEventListener("click", fetchData);
