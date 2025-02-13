// ✅ 環境変数を適切に取得
const API_KEY = import.meta.env.VITE_API_KEY || window.API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID || window.SPREADSHEET_ID;
const SHEET_NAME = import.meta.env.VITE_SHEET_NAME || "Sheet1"; // シート名を `.env` から取得

// ✅ Google Sheets API のエンドポイントを作成
const RANGE = encodeURIComponent(SHEET_NAME);
const URL = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(SPREADSHEET_ID)}/values/${RANGE}?key=${encodeURIComponent(API_KEY)}`;

// ✅ fetchData を先に定義
async function fetchData() {
    try {
        console.log("Fetching data from:", URL);
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }
        const data = await response.json();

        console.log("取得したデータ(JSON):", JSON.stringify(data, null, 2));
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
const departureElem = document.getElementById("departure");
const arrivalElem = document.getElementById("arrival");
const departureLabel = document.querySelector("p:nth-child(1)"); // 「出発地: 」のラベル部分
const arrivalLabel = document.querySelector("p:nth-child(2)"); // 「到着地: 」のラベル部分

if (!randomBtn || !goBtn || !departureElem || !arrivalElem || !departureLabel || !arrivalLabel) {
    console.error("必要なDOM要素が見つかりません。HTMLの構成を確認してください。");
} else {
    let selectedDeparture = "";
    let selectedArrival = "";

    // ✅ クリップボードにコピーする関数（通知なし）
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error("❌ クリップボードへのコピーに失敗しました:", err);
        }
    }

    // ✅ カーナビタイムを警告なしで開く関数
    function openCarNavitime() {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = "carnavitime://";
        document.body.appendChild(iframe);
    }

    // ✅ ランダムボタンの動作
    randomBtn.addEventListener("click", async () => {
        const data = await fetchData();
        if (!data || data.length === 0) {
            alert("スプレッドシートのデータが空です。");
            return;
        }

        // ✅ "高速道路" 以外を出発地候補にする
        const departureCandidates = data.filter(row => row[3] !== "高速道路");
        // ✅ 到着地はすべてのデータを候補にする
        const arrivalCandidates = data;

        if (departureCandidates.length === 0 || arrivalCandidates.length === 0) {
            alert("有効なデータがありません。");
            return;
        }

        // ✅ 出発地（"高速道路" を除外したものからランダム選択）
        const randomDepartureIndex = Math.floor(Math.random() * departureCandidates.length);
        selectedDeparture = departureCandidates[randomDepartureIndex][1] || "不明"; // 緯度経度
        departureElem.innerText = departureCandidates[randomDepartureIndex][0] || "不明"; // 地名
        departureElem.setAttribute("data-location", selectedDeparture);

        // ✅ 到着地（すべてのデータからランダム選択）
        let randomArrivalIndex;
        do {
            randomArrivalIndex = Math.floor(Math.random() * arrivalCandidates.length);
        } while (arrivalCandidates[randomArrivalIndex][1] === selectedDeparture); // 同じ地点にならないようにする

        selectedArrival = arrivalCandidates[randomArrivalIndex][1] || "不明"; // 緯度経度
        arrivalElem.innerText = arrivalCandidates[randomArrivalIndex][0] || "不明"; // 地名
        arrivalElem.setAttribute("data-location", selectedArrival);
    });

    // ✅ 「出発地」のラベル（"出発地: "の部分）クリックで、出発地の位置情報をコピーし、カーナビタイムアプリを開く（警告なし）
    departureLabel.addEventListener("click", () => {
        if (!selectedDeparture || selectedDeparture === "不明") {
            alert("出発地の位置情報が選択されていません。");
            return;
        }
        copyToClipboard(selectedDeparture);

        // ✅ Safariの警告なしでカーナビタイムを開く
        openCarNavitime();
    });

    // ✅ 「到着地」のラベル（"到着地: "の部分）クリックで、到着地の位置情報をコピー
    arrivalLabel.addEventListener("click", () => {
        if (!selectedArrival || selectedArrival === "不明") {
            alert("到着地の位置情報が選択されていません。");
            return;
        }
        copyToClipboard(selectedArrival);
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
}

console.log("✅ 環境変数チェック");
console.log("VITE_API_KEY:", import.meta.env.VITE_API_KEY);
console.log("VITE_SPREADSHEET_ID:", import.meta.env.VITE_SPREADSHEET_ID);
console.log("VITE_SHEET_NAME:", import.meta.env.VITE_SHEET_NAME);
