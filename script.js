// ✅ ボタン要素の取得
const randomBtn = document.getElementById("randomBtn");
const goBtn = document.getElementById("goBtn");
const departureElem = document.getElementById("departure");
const arrivalElem = document.getElementById("arrival");
const arrivalLabel = document.querySelector("p:nth-child(2)"); // 「到着地: 」のラベル部分

if (!randomBtn || !goBtn || !departureElem || !arrivalElem || !arrivalLabel) {
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

        // ✅ 位置情報をクリップボードにコピー（通知なし）
        copyToClipboard(selectedDeparture);

        // ✅ 到着地（すべてのデータからランダム選択）
        let randomArrivalIndex;
        do {
            randomArrivalIndex = Math.floor(Math.random() * arrivalCandidates.length);
        } while (arrivalCandidates[randomArrivalIndex][1] === selectedDeparture); // 同じ地点にならないようにする

        selectedArrival = arrivalCandidates[randomArrivalIndex][1] || "不明"; // 緯度経度
        arrivalElem.innerText = arrivalCandidates[randomArrivalIndex][0] || "不明"; // 地名
        arrivalElem.setAttribute("data-location", selectedArrival);
    });

    // ✅ 「到着地」のテキスト（ラベル部分）クリックで、到着地の位置情報をコピー
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
}
console.log("✅ 環境変数チェック");
console.log("VITE_API_KEY:", import.meta.env.VITE_API_KEY);
console.log("VITE_SPREADSHEET_ID:", import.meta.env.VITE_SPREADSHEET_ID);
console.log("VITE_SHEET_NAME:", import.meta.env.VITE_SHEET_NAME);
