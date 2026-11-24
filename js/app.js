async function getHunts() {
    try {
        const response = await fetch("https://codecyprus.org/th/api/list");
        const data = await response.json();

        let huntList = document.getElementById("hunt-list");

        for (let i = 0; i < data.treasureHunts.length; i++) {

            let option = document.createElement("option");

            option.textContent = data.treasureHunts[i].name;
            option.value = data.treasureHunts[i].uuid;

            huntList.appendChild(option);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

