const wordsList = [
    "quick", "brown", "fox", "jumps", "over", "lazy", "dog",
    "bright", "sun", "moon", "sky", "tree", "river", "mountain",
    "road", "bird", "fish", "flower", "stone", "cloud", "grass",
    "wind", "fire", "earth", "star"
];

let generatedText = [];
let startTime;
let currentWordIndex = 0;
let currentCharIndex = 0;
let totalCharsTyped = 0;

document.getElementById("start-btn").addEventListener("click", startTest);
document.getElementById("reset-btn").addEventListener("click", resetTest);
document.addEventListener("keydown", checkTyping);

function startTest() {
    const wordLength = document.querySelector('input[name="word-length"]:checked').value;
    generateWords(parseInt(wordLength));

    document.getElementById("test-area").style.display = "block";
    document.getElementById("reset-btn").style.display = "block";
    startTime = new Date().getTime(); // Start the timer
    resetTypingState();
    displayWords();
}

function generateWords(count) {
    generatedText = [];
    let tempWords = [];
    for (let i = 0; i < count; i++) {
        const randomWord = wordsList[Math.floor(Math.random() * wordsList.length)];
        tempWords.push(randomWord);
    }
    insertPunctuation(tempWords);
    generatedText = tempWords;
}

function insertPunctuation(textArray) {
    for (let i = 0; i < textArray.length; i++) {
        if (Math.random() > 0.8 && i < textArray.length - 1) {
            textArray[i] += ',';
        } else if (Math.random() > 0.9 && i === textArray.length - 1) {
            textArray[i] += '.';
        }
    }
}

function displayWords() {
    const textContainer = document.getElementById("text-container");
    textContainer.innerHTML = generatedText.map((word, index) => `<span id="word-${index}">${word}</span>`).join(' ');
    highlightCharacter(0, 0); // Highlight the first character of the first word
}

function highlightCharacter(wordIndex, charIndex) {
    const currentWord = generatedText[wordIndex];
    const textContainer = document.getElementById(`word-${wordIndex}`);

    // Clear the current content of the word
    textContainer.innerHTML = '';

    // Rebuild the word with the correct character highlighted
    currentWord.split('').forEach((char, index) => {
        if (index === charIndex) {
            const highlightSpan = document.createElement('span');
            highlightSpan.className = 'highlight';
            highlightSpan.textContent = char;
            textContainer.appendChild(highlightSpan); // Add highlighted character
        } else {
            textContainer.appendChild(document.createTextNode(char)); // Add regular characters
        }
    });
}

function checkTyping(event) {
    const keyPressed = event.key;

    // Ignore non-character keys (except Space)
    if (keyPressed === "Shift" || keyPressed === "Backspace" || keyPressed === "Enter") {
        return;
    }

    const currentWord = generatedText[currentWordIndex];

    // If the spacebar is pressed
    if (keyPressed === " ") {
        event.preventDefault(); // Prevent the default action of the spacebar (e.g., page refresh)
        // Only move to the next word if the current word is completed
        if (currentCharIndex === currentWord.length) {
            currentWordIndex++;
            currentCharIndex = 0;

            // If there's a next word, highlight its first character
            if (currentWordIndex < generatedText.length) {
                highlightCharacter(currentWordIndex, currentCharIndex); // Highlight next word's first character
            }
        }
        return; // Prevent further processing for the spacebar
    }

    // Check if the character typed is correct
    if (keyPressed === currentWord[currentCharIndex]) {
        totalCharsTyped++; // Count the character as typed (correctly)
        currentCharIndex++;

        if (currentCharIndex === currentWord.length) {
            // Highlight will not automatically move to the next line now
            highlightCharacter(currentWordIndex, currentCharIndex); // Remove highlighting from the last character
        } else {
            highlightCharacter(currentWordIndex, currentCharIndex); // Move highlight forward
        }
    }

    // If the last word is typed and the last character is reached, finish the test
    if (currentWordIndex === (generatedText.length - 1) && currentCharIndex === currentWord.length) {
        finishTest();
    }
}

function finishTest() {
    const endTime = new Date().getTime();
    const totalTime = (endTime - startTime) / 1000 / 60; // Convert time to minutes

    const wpm = Math.round((generatedText.length / totalTime)); // Calculate WPM

    // Display only the WPM result
    document.getElementById("wpm").innerHTML = `<strong>${wpm} WPM</strong>`; // Show WPM in bold
    document.querySelector(".results").style.display = "block"; // Show results

    // Disable typing area after finishing
    document.removeEventListener("keydown", checkTyping);
}

function resetTest() {
    document.getElementById("test-area").style.display = "none";
    document.getElementById("wpm").innerHTML = "WPM: 0"; // Reset WPM display
    generatedText = [];
    currentWordIndex = 0;
    currentCharIndex = 0;
    totalCharsTyped = 0;

    // Re-add the event listener for keydown after resetting
    document.addEventListener("keydown", checkTyping);
}

function resetTypingState() {
    currentWordIndex = 0;
    currentCharIndex = 0;
    totalCharsTyped = 0;
    document.querySelector(".results").style.display = "none";
}
