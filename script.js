document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('result');
    const buttons = document.querySelectorAll('.button');

    let currentInput = '0';
    let previousInput = '';
    let operator = null;
    let awaitingNextInput = false;

    function updateDisplay() {
        display.value = currentInput;
    }

    function clear() {
        currentInput = '0';
        previousInput = '';
        operator = null;
        awaitingNextInput = false;
        updateDisplay();
    }

    function toggleSign() {
        if (currentInput === '0') return;
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay();
    }

    function percentage() {
        if (currentInput === '0') return;
        currentInput = (parseFloat(currentInput) / 100).toString();
        updateDisplay();
    }

    function inputDigit(digit) {
        if (awaitingNextInput) {
            currentInput = digit;
            awaitingNextInput = false;
        } else {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplay();
    }

    function inputDecimal() {
        if (awaitingNextInput) {
            currentInput = '0.';
            awaitingNextInput = false;
            updateDisplay();
            return;
        }
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay();
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);

        if (operator && awaitingNextInput) { // Allows changing operator
            operator = nextOperator;
            // Add visual feedback for active operator if desired
            setActiveOperator(nextOperator);
            return;
        }

        if (previousInput === '') {
            previousInput = inputValue;
        } else if (operator) {
            const result = calculate();
            currentInput = String(result);
            previousInput = result;
        }

        awaitingNextInput = true;
        operator = nextOperator;
        updateDisplay();
        // Add visual feedback for active operator
        setActiveOperator(nextOperator);
    }

    function setActiveOperator(op) {
        // Remove active class from all operators
        document.querySelectorAll('.operator').forEach(btn => btn.classList.remove('active'));
        // Add active class to the current operator button
        if (op) {
            let opButton;
            if (op === '+') opButton = document.querySelector('.button.operator.addition');
            else if (op === '-') opButton = document.querySelector('.button.operator.subtraction');
            else if (op === '*') opButton = document.querySelector('.button.operator.multiplication');
            else if (op === '/') opButton = document.querySelector('.button.operator.division');

            if (opButton) opButton.classList.add('active');
        }
    }


    function calculate() {
        if (!operator || previousInput === '') return parseFloat(currentInput);

        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return; // Should not happen with proper input handling

        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    // Display Error instead of crashing or returning Infinity
                    clear(); // Or set currentInput to "Error" and handle it
                    currentInput = "Error";
                    updateDisplay();
                    return "Error"; // Special value to indicate error
                }
                result = prev / current;
                break;
            default:
                return current;
        }
        // Remove active class from operators after calculation
        setActiveOperator(null);
        return result;
    }


    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const { classList, textContent } = button;

            if (classList.contains('number')) {
                // If there was an error, start fresh
                if (currentInput === "Error") {
                    clear();
                }
                inputDigit(textContent);
            } else if (classList.contains('dot')) {
                 if (currentInput === "Error") {
                    clear();
                }
                inputDecimal();
            } else if (classList.contains('operator')) {
                 if (currentInput === "Error") return; // Don't allow operations on error
                if (textContent === '×') handleOperator('*');
                else if (textContent === '÷') handleOperator('/');
                else if (textContent === '+') handleOperator('+');
                else if (textContent === '−') handleOperator('-');
                else if (textContent === '=') {
                    if (operator === null || currentInput === "Error") return;
                    const calcResult = calculate();
                     if (calcResult === "Error") {
                        // Error already handled by calculate function
                        return;
                    }
                    currentInput = String(calcResult);
                    previousInput = ''; // Reset previousInput for new calculations
                    operator = null;
                    awaitingNextInput = false; // Ready for new input or chained calculation
                    updateDisplay();
                    setActiveOperator(null); // Clear active operator style
                }
            } else if (classList.contains('function')) {
                if (textContent === 'AC') {
                    clear();
                } else if (textContent === '±') {
                    if (currentInput === "Error") return;
                    toggleSign();
                } else if (textContent === '%') {
                    if (currentInput === "Error") return;
                    percentage();
                }
            }
        });
    });

    updateDisplay(); // Initialize display
});
