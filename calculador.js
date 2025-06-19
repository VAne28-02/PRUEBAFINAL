// Variables globales
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let resetScreen = false;

// Elementos del DOM
const currentOperandElement = document.getElementById('current-operand');
const previousOperandElement = document.getElementById('previous-operand');

// Inicialización
updateDisplay();

// Event listeners para números
document.querySelectorAll('[id^="number-"]').forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.textContent);
        updateDisplay();
    });
});

// Event listeners para operaciones
document.querySelectorAll('.operation-btn').forEach(button => {
    button.addEventListener('click', () => {
        setOperation(button.textContent);
        updateDisplay();
    });
});

// Event listener para igual
document.getElementById('equals').addEventListener('click', () => {
    compute();
    updateDisplay();
});

// Event listener para limpiar
document.getElementById('clear').addEventListener('click', clear);

// Event listener para borrar
document.getElementById('delete').addEventListener('click', deleteNumber);

// Event listener para punto decimal
document.getElementById('decimal').addEventListener('click', appendDecimal);

// Event listener para guardar
document.getElementById('save').addEventListener('click', saveCalculation);

// Funciones principales
function appendNumber(number) {
    if (currentOperand === '0' || resetScreen) {
        currentOperand = '';
        resetScreen = false;
    }
    currentOperand += number;
}

function appendDecimal() {
    if (resetScreen) {
        currentOperand = '0';
        resetScreen = false;
    }
    if (currentOperand.includes('.')) return;
    if (currentOperand === '') currentOperand = '0';
    currentOperand += '.';
}

function deleteNumber() {
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

function setOperation(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        compute();
    }
    
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
}

function compute() {
    if (operation === undefined || currentOperand === '') return;
    
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+': computation = prev + current; break;
        case '-': computation = prev - current; break;
        case '×': computation = prev * current; break;
        case '÷': computation = prev / current; break;
        default: return;
    }

    // Guardar automáticamente al calcular
    const calculation = {
        expression: `${previousOperand} ${operation} ${currentOperand}`,
        result: computation.toString(),
        date: new Date().toLocaleString()
    };

    saveToHistory(calculation);
    
    currentOperand = computation.toString();
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

function updateDisplay() {
    currentOperandElement.textContent = currentOperand;
    previousOperandElement.textContent = previousOperand + (operation ? ` ${operation}` : '');
}

function saveCalculation() {
    if (previousOperand && operation && currentOperand) {
        compute(); // Si hay operación pendiente, calcúlala primero
        return;
    }
    
    if (currentOperand === '0' || (!previousOperand && !operation)) {
        showNotification('Realiza un cálculo primero', 'error');
        return;
    }

    const calculation = {
        expression: currentOperand,
        result: currentOperand,
        date: new Date().toLocaleString()
    };

    saveToHistory(calculation);
    showNotification('Número guardado: ' + currentOperand, 'success');
    clear();
}

function saveToHistory(calculation) {
    const history = JSON.parse(localStorage.getItem('calculationsHistory')) || [];
    history.unshift(calculation);
    localStorage.setItem('calculationsHistory', JSON.stringify(history));
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

