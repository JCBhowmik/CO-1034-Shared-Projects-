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

let sessionID = "";
getHunts();


async function startGame() {

    let playerName = document.getElementById("player-name").value;
    let huntUUID = document.getElementById("hunt-list").value;

    if (playerName.trim() === "") {
        alert("Please enter your name");
        return;
    }

    let url = "https://codecyprus.org/th/api/start"
        + "?player=" + encodeURIComponent(playerName)
        + "&app=TreasureHunt"
        + "&treasure-hunt-id=" + encodeURIComponent(huntUUID);

    console.log(encodeURIComponent(playerName));
    console.log(huntUUID);
    console.log(url);

    try {

        const response = await fetch(url);
        const data = await response.json();

        console.log(data);
        if (data.status === "OK") {
            sessionID = data.session;
            document.getElementById("start-message").textContent = "Game started!!!";
            console.log("sessionID: " + sessionID);
            console.log("Game started successfully!");
            await getQuestion();
        } else {
            document.getElementById("start-message").textContent = data.errorMessages[0];
        }
        console.log(data.status);
        console.log(data.session);
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("start-message").textContent = "Something went wrong! Please try again";

    }

}

async function getQuestion() {
    let url = "https://codecyprus.org/th/api/question"
        + "?session=" + encodeURIComponent(sessionID);

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

        if (data.status === "OK") {

            // Check game completion
            if (data.completed === true) {
                document.getElementById("question-title").textContent =
                    "Game Completed!";

                document.getElementById("question-text").textContent =
                    "Congratulations! You have finished the treasure hunt.";

                document.getElementById("submit-answer").disabled = true;
                document.getElementById("skip-question").disabled = true;

                return;
            }

            // Display question
            document.getElementById("question-text").innerHTML =
                data.questionText;

            // Display question number
            document.getElementById("question-title").textContent =
                "Question " + (data.currentQuestionIndex + 1)
                + " of " + data.numOfQuestions;

            // Control skip button
            document.getElementById("skip-question").disabled =
                !data.canBeSkipped;

            document.getElementById("submit-answer").disabled = false;
        } else {
            document.getElementById("question-text").textContent =
                data.errorMessages[0];
        }
    } catch (error) {
        console.error("Error:", error);

        document.getElementById("question-text").textContent =
            "Unable to retrieve question. Please try again.";
    }
}

document.getElementById("start-game").addEventListener("click", startGame);

document.getElementById("submit-answer").disabled = true;
document.getElementById("skip-question").disabled = true;
