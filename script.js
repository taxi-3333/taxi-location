// 環境変数から API キーとスプレッドシートIDを取得
const API_KEY = process.env.API_KEY;  // Netlifyの環境変数を取得
const SPREADSHEET_ID = process.env.SPREADSHEET_ID; // Netlifyの環境変数を取得

console.log("API_KEY:", API_KEY);  // デバッグ用
console.log("SPREADSHEET_ID:", SPREADSHEET_ID);  // デバッグ用

// Google Sheets API のエンドポイント
const RANGE = "シート1!A1:B10"; // 取得したいセル範囲を指定
const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Fetched data:", data);  // デバッグ用
    if (data.values) {
      updateUI(data.values);
    } else {
      console.error("No data found in the response.");
    }
  })
  .catch(error => console.error("Error fetching data:", error));

// UI 更新処理
function updateUI(values) {
  if (values.length > 0) {
    const departureElement = document.getElementById("departure");
    const arrivalElement = document.getElementById("arrival");

    // 出発地と到着地をランダムに取得
    const randomIndex = Math.floor(Math.random() * values.length);
    const [departure, arrival] = values[randomIndex];

    departureElement.textContent = departure || "不明";
    arrivalElement.textContent = arrival || "不明";

    // Google マップで開くリンクを設定
    departureElement.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(departure)}`;
    arrivalElement.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(arrival)}`;
  }
}

// ランダムボタンのイベント
document.getElementById("randomBtn").addEventListener("click", () => {
  location.reload();
});

// GOボタンのイベント（Googleマップ開く）
document.getElementById("goBtn").addEventListener("click", () => {
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(arrival)}`);
});
