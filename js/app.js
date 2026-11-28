/*-------------------- Retrieve Treasure Hunts --------------------*/

async function getHunts() {
    try {
        const response = await fetch("https://codecyprus.org/th/api/list");
        const data = await response.json();

        let huntList = document.getElementById("hunt-list");

        // Add available treasure hunts to the dropdown
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


/*-------------------- Game Session --------------------*/

let sessionID = "";

getHunts();


/*-------------------- Start Game --------------------*/

async function startGame() {

    // Retrieve player name and selected treasure hunt
    let playerName = document.getElementById("player-name").value;
    let huntUUID = document.getElementById("hunt-list").value;

    // Validate player name
    if (playerName.trim() === "") {
        alert("Please enter your name");
        return;
    }

    // Make the API URL
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

        // Check whether the game started successfully
        if (data.status === "OK") {

            sessionID = data.session;

            document.getElementById("start-message").textContent =
                "Game started!!!";

            console.log("sessionID: " + sessionID);
            console.log("Game started successfully!");

            await getQuestion();

        } else {

            document.getElementById("start-message").textContent =
                data.errorMessages[0];
        }

        console.log(data.status);
        console.log(data.session);

    } catch (error) {
        console.error("Error:", error);

        document.getElementById("start-message").textContent =
            "Something went wrong! Please try again";
    }
}


/*-------------------- Retrieve Questions --------------------*/

async function getQuestion() {

    // Make the API URL
    let url = "https://codecyprus.org/th/api/question"
        + "?session=" + encodeURIComponent(sessionID);

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

        if (data.status === "OK") {

            // Check whether the game is completed
            if (data.completed === true) {

                document.getElementById("question-title").textContent =
                    "Game Completed!";

                document.getElementById("question-text").textContent =
                    "Congratulations! You have finished the treasure hunt.";

                document.getElementById("submit-answer").disabled = true;
                document.getElementById("skip-question").disabled = true;

                return;
            }

            // Display the current question
            document.getElementById("question-text").innerHTML =
                data.questionText;

            // Display the question number
            document.getElementById("question-title").textContent =
                "Question " + (data.currentQuestionIndex + 1)
                + " of " + data.numOfQuestions;

            // Control the skip button
            document.getElementById("skip-question").disabled =
                !data.canBeSkipped;

            // Enable the submit button
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


/*-------------------- Submit Answer --------------------*/

async function submitAnswer(event) {

    // Prevent the form from refreshing the page
    event.preventDefault();

    // Get the player's answer
    let answer = document.getElementById("answer").value;

    // Validate the game session
    if (sessionID === "") {
        alert("Please start the game first");
        return;
    }

    // Validate the player's answer
    if (answer.trim() === "") {
        alert("Please enter an answer");
        return;
    }

    // Make the API URL
    let url = "https://codecyprus.org/th/api/answer"
        + "?session=" + encodeURIComponent(sessionID)
        + "&answer=" + encodeURIComponent(answer);

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

        if (data.status === "OK") {

            // Display answer feedback
            document.getElementById("answer-feedback").textContent =
                data.message;

            // Get the next question if the answer is correct
            if (data.correct === true) {

                document.getElementById("answer").value = "";

                await getQuestion();
            }

        } else {

            document.getElementById("answer-feedback").textContent =
                data.errorMessages[0];
        }

    } catch (error) {
        console.error("Error:", error);

        document.getElementById("answer-feedback").textContent =
            "Something went wrong! Please try again.";
    }
}


/*-------------------- Skip Question --------------------*/

async function skipQuestion() {

    // Validate the game session
    if (sessionID === "") {
        alert("Please start the game first");
        return;
    }

    // Make the API URL
    let url = "https://codecyprus.org/th/api/skip"
        + "?session=" + encodeURIComponent(sessionID);

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

        if (data.status === "OK") {

            // Display skip feedback
            document.getElementById("answer-feedback").textContent =
                data.message;

            // Clear the answer box
            document.getElementById("answer").value = "";

            // Get the next question
            await getQuestion();

        } else {

            document.getElementById("answer-feedback").textContent =
                data.errorMessages[0];
        }

    } catch (error) {
        console.error("Error:", error);

        document.getElementById("answer-feedback").textContent =
            "Unable to skip Question!";
    }
}


/*-------------------- Initial Button States --------------------*/

// Disable answer and skip buttons before starting the game
document.getElementById("submit-answer").disabled = true;
document.getElementById("skip-question").disabled = true;


/*-------------------- Event Listeners --------------------*/

// Start game button
document.getElementById("start-game")
    .addEventListener("click", startGame);

// Submit answer form
document.getElementById("answer-form")
    .addEventListener("submit", submitAnswer);

// Skip question button
document.getElementById("skip-question")
    .addEventListener("click", skipQuestion);