const { remote, ipcRenderer } = require("electron");
const { readFileSync } = require("fs");


(async function (){

    function generateFlag() {
        const flagELM = document.createElement("div");
        flagELM.id = "unusedFlag";
        flagELM.style = `
            z-index: 99;
            background: green;
            width: 10px;
            height: 10px;
            bottom: 0px;
            left: 0px;
            position: fixed;
            display: block;
            pointer-events: none;
        `;
        document.body.appendChild(flagELM);
    }

    async function getCSVpath() {
        return await remote.dialog.showOpenDialog(remote.getCurrentWindow(),{extensions:["csv"]}) // todo: description for CSV, remember last path
    }

    function browseWindowGoto(link) {
        ipcRenderer.send("bw-goto", link);
    }

    function generatePrivacyEditURL(videoID) {
        return `https://youtube.com/edit?video_id=${videoID}&nps=1&ar=${Date.now()}&nv=1`;
    }

    function setUnusedFlag(isUnused) {
        const flagELM = document.querySelector("#unusedFlag");
        if (flagELM !== undefined) {
            flagELM.style.background = isUnused ? "green" : "red";
        }
    }

    function NavToHTML(linkPairs) {
        const nav = document.createElement("nav");

        linkPairs.forEach(pair => {
            broken = (pair[0] == undefined || pair[0] == "") ? true : false;
            if (!broken) {
                const link = document.createElement("a");
                link.href = "#";
                link.onclick = (e)=>{
                    e.preventDefault();
                    browseWindowGoto(generatePrivacyEditURL(pair[0]));
                    link.className = "clicked";
                }
                link.onfocus = (e)=>{
                    setUnusedFlag(!(link.className === "clicked"));
                }
                link.innerHTML = pair.length > 0 ? pair[1] : pair[0];
                nav.appendChild(link);
            }
        })

        document.body.appendChild(nav);
    }

    try {
        const text = readFileSync((await getCSVpath()).filePaths[0]).toString(); // todo: guarantee utf-8
        const lines = text.split("\n").map(line => line.split(";"));
        document.body.innerHTML = ""; // Remove possible previous errors
        NavToHTML(lines);
        generateFlag();
    } catch (e) {
        document.body.innerHTML = "No compatible ids.csv file entered.<br><button onclick=\"window.location.reload()\">Try again</button>"
    }

})();