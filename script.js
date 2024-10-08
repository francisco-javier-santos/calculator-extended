// Global variables to link HTML elements 
const buttons = document.querySelectorAll('button') // Selects all html <button> elements 
const display = document.querySelector('.number-on-screen') // Selects the element with class="number-on-screen"

// Global variables
let currentNumber = '' // To store our numbers.
let currentOperator = '' // To store our operator sign.

// These variables are for checking if there is a value (false means no, true means yes)
let inputValue = false
let pressedEquals = false 

// Function to assign our calculation to the variable currentNumber
function storeCalc(operator) {
    if (!currentNumber) {
        currentNumber = display.textContent
    }
    else { 
        currentNumber = operate(Number(currentNumber), currentOperator, Number(display.textContent))
    }
  
    currentOperator = operator
    inputValue = true 
    pressedEquals = false
}

// Calculations 
function operate(a, operator, b) {
    if (operator == '+') {
        return add(a, b) 
    }
    else if (operator == '—') {
        return subtract(a, b)
    }
    else if (operator == 'X') {
        return multiply(a, b) 
    }
    else if (operator == '/') {
        return divide(a, b)
        } 
    else {
        return null; 
    }
}

// Functions called in the operate function

// Add 2 numbers
function add(a, b) {
    return a + b
}

// Subtract 2 numbers
function subtract(a, b) {
    return a - b
}

// Multiply 2 numbers
function multiply(a, b) {
    return a * b
}

// Divide 2 numbers
function divide(a, b) {
    return a / b
}


// Reset function to rollback to blank strings, and the display with 0 
function clear() {
    display.textContent = 0
    currentNumber = ''
    currentOperator = ''
}

// Function to undo last user's input to avoid making mistakes.
function backspace() {
    let displayNum = display.textContent;
    if (displayNum.length > 1) {
        setDisplay(displayNum.slice(0, -1)); // Elimina el último carácter
    } else {
        setDisplay('0'); // Si sólo queda un carácter, vuelve a 0
    }
}

// Function addToDisplay gets called in our buttons.forEach function
function addToDisplay(number) {
    let displayNum = display.textContent;

    if (inputValue) {
        inputValue = false;
        setDisplay(number);
    } else if (displayNum === '0' && number !== '.') {
        setDisplay(number);
    } else {
        if (number === '.' && displayNum.includes('.')) {
            return; // No permite más de un decimal
        }

        const newNumber = displayNum + number;

        // Comprobar si el nuevo número excede el límite (considerando decimales)
        if (parseFloat(newNumber) <= Math.pow(2, 30)) {
            setDisplay(newNumber);
        } else {
            alert(`Error: Number exceeds the limit of ${Math.pow(2, 30)}.`); // Mensaje de error
        }
    }
}

// Function to show new display value
function setDisplay(displayNum) { 
    displayNum = displayNum.toString();

    // Comprobar si el número excede 2^30
    const limit = Math.pow(2, 30);
    if (parseFloat(displayNum) > limit) {
        alert(`Error: Number exceeds the limit of ${limit}. Resetting...`); // Mensaje de error
        clear(); // Reinicia la calculadora
        return; // Salimos de la función
    }

    if (displayNum.length > 12){
        alert(`Error: Number exceeds the limit of 12 characters.`); // Mensaje de error
        return;
    }

    // Comprobar si el número tiene más de 9 caracteres
    if (displayNum.length > 9) {
        // Convertir a notación exponencial, pero solo si no es decimal
        if (!displayNum.includes('.')) {
            displayNum = parseFloat(displayNum);
            displayNum = displayNum.toExponential(2);
        }
    }

    display.textContent = displayNum;
}



// Function to register our buttons event from HTML to JavaScript 
buttons.forEach(button =>{ // Calls function for each element in 'buttons', with button as parameter
    button.addEventListener('click', function(){ // Add a click listener event to the button
        let input = this.textContent // Get the input from the text's content
         
        if (/\d/.test(input)) { // We're looking for a digit input
            if (pressedEquals) { // If true, then execute the function setDisplay
                setDisplay(input) // Applies setDisplay to textContent (format)
                pressedEquals = false
            } 
            else { // If there are no digits above, then we want to add numbers to display
                addToDisplay(input) // applies our function addToDsiplay to our textContent ()
            }
        }

        else if (input == '←') { // Check if input is undo last writing
            backspace(); // call method to do so.
        }

        else if (input == 'AC') { // Checking if AC button was pressed
            clear() // call clear() method to reset the calculator
        }

        else if (input == '=') { // Check if = was pressed
            if (!currentNumber || !currentOperator) { // Need to confirm if there is numbers and an operator. If one of those are missing...
                alert('Error: no operation entered. Clearing data') // Display an alert box window with message.
                clear() // clear() method removes all the Storage Object item for this domain.
            }
            else { 
                currentNumber = operate(Number(currentNumber), currentOperator, Number(display.textContent)) // Assign to currentNumber with result of operate(a, operator, b) 
                currentOperator = '' // Set currentOperator variable empty.
                setDisplay(currentNumber) // Callsfunction setDisplay, to display our currentNumber variable.
                currentNumber = '' // Sets currentNumber variable empty.
                pressedEquals = true // Set pressedEquals variable from false to true (since we have a value).
            }
        }

        else { 
            storeCalc(input) // New imput gets saved.
        } 
    }) 
}); 

// Keyboard support (experimental)
document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (/\d/.test(key)) { // Si es un número
        addToDisplay(key);
    } 
    else if (key === '.') {
        addToDisplay(key);
    }
    else if (key === 'Backspace') {
        backspace();
    }
    else if (key === 'Enter' || key === '=') {
        document.querySelector('#pad-button-equal-sign').click(); // Simula click en '='
    }
    else if (key === 'Escape') {
        clear(); // Limpia todo con 'Escape'
    }
    else if (['+', '-', '*', '/'].includes(key)) {
        storeCalc(key);
    }
});
