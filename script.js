// ✅ 環境変数を適切に取得
const API_KEY = import.meta.env.VITE_API_KEY || window.API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID || window.SPREADSHEET_ID;
const SHEET_NAME = import.meta.env.VITE_SHEET_NAME || "Sheet1"; // シート名を `.env` から取得

// ✅ Google Sheets API のエンドポイントを作成
const RANGE = encodeURIComponent(SHEET_NAME);
const URL = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(SPREADSHEET_ID)}/values/${RANGE}?key=${encodeURIComponent(API_KEY)}`;

// ✅ グローバルスコープで出発地と到着地の変数を定義
let selectedDeparture = "";
let selectedArrival = "";// ✅ "到着地" → "目的地" に変更

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
const swapBtn = document.getElementById("swapBtn"); // ✅ 着発ボタン
const googleBtn = document.getElementById("goBtn");
const departureElem = document.getElementById("departure");
const arrivalElem = document.getElementById("arrival");// ✅ 目的地
const departureLabel = document.querySelector("p:nth-child(1)"); // 「出発地: 」のラベル部分
const arrivalLabel = document.querySelector("p:nth-child(2)"); // 「目的地: 」のラベル部分に変更

if (!randomBtn || !swapBtn || !googleBtn || !departureElem || !arrivalElem || !departureLabel || !arrivalLabel) {
    console.error("必要なDOM要素が見つかりません。HTMLの構成を確認してください。");
} else {
    let swapUsed = false; // ✅ 初回かどうかのフラグ

    // ✅ クリップボードにコピーする関数（通知なし）
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error("❌ クリップボードへのコピーに失敗しました:", err);
        }
    }

    // ✅ Googleマップで開く関数
    function openInGoogleMaps(event) {
        const location = event.target.getAttribute("data-location");
        if (!location || location === "不明") {
            alert("位置情報がありません。");
            return;
        }

        // ✅ Googleマップで緯度経度を検索
        const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(location)}`;
        window.open(mapUrl, "_blank");
    }

    // ✅ 出発地・到着地クリックで Googleマップを開く
    departureElem.addEventListener("click", openInGoogleMaps);
    arrivalElem.addEventListener("click", openInGoogleMaps);

    // ✅ ランダムボタンの動作
    randomBtn.addEventListener("click", async () => {
        const data = await fetchData();
        if (!data || data.length === 0) {
            alert("スプレッドシートのデータが空です。");
            return;
        }

        // ✅ "高速道路" 以外を出発地候補にする
        const departureCandidates = data.filter(row => row[3] !== "高速道路");
        // ✅ 目的地はすべてのデータを候補にする
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
        arrivalElem.setAttribute("data-location", selectedArrival);// ✅ 目的地
    });

    // ✅ 「着発」ボタンの動作（復活！）
    swapBtn.addEventListener("click", async () => {
        const data = await fetchData();
        if (!data || data.length === 0) {
            alert("スプレッドシートのデータが空です。");
            return;
        }

        if (!swapUsed) {
            // ✅ 初回はランダムボタンと同じ処理をする
            swapUsed = true;
            randomBtn.click();
        } else {
            // ✅ 2回目以降: 到着地を出発地に、到着地は新しくランダム選択
            const arrivalText = arrivalElem.innerText;
            const arrivalLocation = selectedArrival;

            if (arrivalLocation === "不明") {
                alert("到着地が設定されていません。");
                return;
            }

            selectedDeparture = arrivalLocation;
            departureElem.innerText = arrivalText;
            departureElem.setAttribute("data-location", selectedDeparture);

            // ✅ 新しい到着地をランダムに選択
            let randomArrivalIndex;
            do {
                randomArrivalIndex = Math.floor(Math.random() * data.length);
            } while (data[randomArrivalIndex][1] === selectedDeparture); // 同じ地点にならないようにする

            selectedArrival = data[randomArrivalIndex][1] || "不明"; // 緯度経度
            arrivalElem.innerText = data[randomArrivalIndex][0] || "不明"; // 地名
            arrivalElem.setAttribute("data-location", selectedArrival);
        }
    });
}

console.log("✅ 環境変数チェック");
console.log("VITE_API_KEY:", import.meta.env.VITE_API_KEY);
console.log("VITE_SPREADSHEET_ID:", import.meta.env.VITE_SPREADSHEET_ID);
console.log("VITE_SHEET_NAME:", import.meta.env.VITE_SHEET_NAME);

// ✅ 「Google」ボタンの動作（復活！）
googleBtn.addEventListener("click", () => {
    if (!selectedDeparture || !selectedArrival || selectedDeparture === "不明" || selectedArrival === "不明") {
        alert("出発地または目的地が選択されていません。");
        return;
    }

    // ✅ Googleマップのルート検索URL（車でのナビ）
    const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(selectedDeparture)}&destination=${encodeURIComponent(selectedArrival)}&travelmode=driving`;

    // ✅ 新しいタブでGoogleマップを開く
    window.open(mapUrl, "_blank");
});
// ✅ トグルスイッチの取得
const departureToggle = document.getElementById("departureToggle");
const arrivalToggle = document.getElementById("arrivalToggle");

if (departureToggle) {
    departureToggle.addEventListener("change", () => {
        if (departureToggle.checked) {
            console.log("✅ 出発地スイッチ ON");
        } else {
            console.log("❌ 出発地スイッチ OFF");
        }
    });
}

if (arrivalToggle) {
    arrivalToggle.addEventListener("change", () => {
        if (arrivalToggle.checked) {
            console.log("✅ 目的地スイッチ ON");
        } else {
            console.log("❌ 目的地スイッチ OFF");
        }
    });
}