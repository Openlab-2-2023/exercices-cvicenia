const editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    mode: 'javascript',
    lineNumbers: true,
    theme: 'default',
    matchBrackets: true,
    lineWrapping: true,
    indentUnit: 4
});

// Set the initial content of the editor
editor.setValue(initialCode);

function toggleExercise(id) {
    let content = document.getElementById("exercise" + id);
    content.style.display = content.style.display === "none" || content.style.display === "" ? "block" : "none";
}

function toggleSection(sectionClass) {
    const sectionExercises = document.querySelectorAll(`.${sectionClass}`);
    const isVisible = Array.from(sectionExercises).some(exercise => exercise.style.display === 'block');

    sectionExercises.forEach(exercise => {
        exercise.style.display = isVisible ? 'none' : 'block';
    });
}

function runCode() {
    const code = editor.getValue();
    const outputDiv = document.getElementById('output');

    outputDiv.textContent = ""; // Clear previous output

    const oldConsoleLog = console.log;
    console.log = function (message) {
        outputDiv.textContent += message + "\n";
        oldConsoleLog.apply(console, arguments);
    };

    try {
        new Function(code)();
    } catch (error) {
        console.log("Error: " + error.message);
    }

    console.log = oldConsoleLog;
}

function clearOutput() {
    const output = document.getElementById('output');
    output.innerHTML = '';
}

function clearEditor() {
    editor.setValue('');
}

function hangman(word) {
    toggleExercise(10); // Ensure the exercise content is displayed

    let lives = word.length;
    let guessedWord = '_'.repeat(word.length);
    const display = document.getElementById('hangman-display');
    const livesDisplay = document.getElementById('hangman-lives');
    const input = document.getElementById('hangman-input');

    function updateDisplay() {
        display.innerHTML = guessedWord.split('').join(' ');
        livesDisplay.innerHTML = `❤️: ${lives}`;
    }

    function playHangman() {
        const guess = input.value.toLowerCase();
        input.value = '';
        if (guess.length !== 1) {
            alert('Prosím, zadajte jeden znak.');
            return;
        }

        let correctGuess = false;
        let newGuessedWord = '';
        for (let i = 0; i < word.length; i++) {
            if (word[i] === guess) {
                newGuessedWord += guess;
                correctGuess = true;
            } else {
                newGuessedWord += guessedWord[i];
            }
        }
        guessedWord = newGuessedWord;

        if (!correctGuess) {
            lives--;
        }

        if (lives <= 0) {
            display.innerHTML = `Prehrali ste! Slovo bolo: ${word}`;
            return;
        }

        if (guessedWord === word) {
            display.innerHTML = `Vyhrali ste! Slovo je: ${word}`;
            return;
        }

        updateDisplay();
    }

    updateDisplay();
    window.playHangman = playHangman; // Expose the function to the global scope
}