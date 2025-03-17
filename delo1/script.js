document.addEventListener("DOMContentLoaded", function () {
    let csvData = new Map();
    let isCSVLoaded = false;
    let firstCodeEntered = false;

    function showAudioPlayer() {
        document.getElementById("listenBtn").style.display = "none";
        document.getElementById("audioPlayer").style.display = "block";
    }

    document.getElementById("listenBtn").addEventListener("click", () => {
        showAudioPlayer();
        const voiceMessage = document.getElementById("voiceMessage");
        voiceMessage.play().catch(e => console.warn("Автовоспроизведение не поддерживается:", e));
        if (!isCSVLoaded) {
            document.getElementById("mainContent").style.display = "block";
            loadCSV();
            isCSVLoaded = true;
        }
    });

    document.getElementById("relistenBtn").addEventListener("click", () => {
        document.getElementById("audioPlayer").style.display = "block";
        document.getElementById("relistenBtn").style.display = "none";
        const voiceMessage = document.getElementById("voiceMessage");
        voiceMessage.play().catch(e => console.warn("Автовоспроизведение не поддерживается:", e));
    });

    document.getElementById("searchBtn").addEventListener("click", searchCSV);

    function loadCSV() {
        fetch('document.csv')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Не удалось загрузить CSV-файл");
                }
                return response.text();
            })
            .then(text => {
                parseCSV(text);
            })
            .catch(err => {
                console.error(err);
                document.getElementById("result").textContent = "Ошибка загрузки document.csv";
            });
    }

    function parseCSV(text) {
        csvData.clear();
        let rows = text.split("\n");
        rows.forEach(row => {
            let columns = row.split(",");
            if (columns.length >= 2) {
                let code = columns[0].trim().toLowerCase();
                let textB = columns[1].trim();
                csvData.set(code, textB);
            }
        });
    }

    function searchCSV() {
        const query = document.getElementById("query").value.trim().toLowerCase();
        const resultBlock = document.getElementById("resultBlock");
        resultBlock.innerHTML = "";
        window.scrollTo({ top: 0, behavior: "smooth" });

        if (!query) {
            resultBlock.innerHTML = `<p id="result">Пожалуйста, введите код.</p>`;
            resultBlock.style.display = "block";
            return;
        }

        if (csvData.size === 0) {
            resultBlock.innerHTML = `<p id="result">CSV-файл не загружен или пуст.</p>`;
            resultBlock.style.display = "block";
            return;
        }

        const result = csvData.get(query) || "Информация не найдена.";
        resultBlock.innerHTML = `<p id="result">${result}</p>`;
        resultBlock.style.display = "block";
    }
});
