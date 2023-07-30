const buttons = document.querySelector('.buttons-container').children;
const output = document.querySelector('.output');
const input = document.querySelector('.input');
const info = document.querySelector('.info');
let buffer = '0';
let initialValue = 0;
let finalValue = 0;
let operator;
let calculating = true;
const smallText = document.createElement('sub');

for (const button of buttons) {
  button.addEventListener('click', handleButton);

  button.addEventListener('transitionend', (e) => {
    e.target.classList.remove('clicked');
  });
}

function handleButton(e) {
  e.target.classList.add('clicked');
  if (isNaN(e.target.textContent)) {
    handleSymbol(e.target.textContent);
  } else {
    handleNumber(e.target.textContent);
  }
}

function handleSymbol(value) {
  switch (value) {
    case 'ON':
    case 'OFF':
      onOffCalculator(value);
      break;
    case 'C':
    case 'DEL':
      deleteOutput(value);
      break;
    case '.':
      handlePoint(value);
      break;
    case '+':
    case '-':
    case '÷':
    case 'x':
      handleMath(value);
      break;
    case '=':
      flushOperation(+buffer);
      break;
    default:
  }
}

function onOffCalculator(value) {
  if (value === 'ON') {
    buffer = '0';
    initialValue = 0;
    finalValue = 0;
    operator = null;
    calculating = true;
    output.textContent = buffer;
    output.style.fontSize = '1.9rem';
    document.querySelector('.clear').textContent = 'OFF';
  } else {
    buffer = '0';
    initialValue = 0;
    finalValue = 0;
    operator = null;
    calculating = true;
    output.textContent = '';
    input.textContent = '';
    output.style.fontSize = '1.9rem';
    document.querySelector('.clear').textContent = 'ON';
  }
}

function deleteOutput(value) {
  if (output.textContent === '') {
    return;
  }

  if (value === 'C') {
    buffer = '0';
    initialValue = 0;
    finalValue = 0;
    operator = null;
    calculating = true;
    output.textContent = buffer;
    input.textContent = '';
    output.style.fontSize = '1.9rem';
  } else if (value === 'DEL') {
    if (input.textContent.includes('=')) {
      input.textContent = '';
    } else if (calculating) {
      return;
    } else if (!calculating) {
      if (buffer.length === 1) {
        buffer = '0';
        output.textContent = buffer;
        output.style.fontSize = '1.9rem';
      } else {
        buffer = buffer.slice(0, -1);
        output.textContent = buffer;
      }
    }
  }
}

function handlePoint(value) {
  if (output.textContent === '') {
    return;
  }

  // Check if previous calculation has been done
  if (input.textContent.includes('=')) {
    input.textContent = '';
  }
  // End

  if (buffer.includes(value)) {
    return;
  } else {
    buffer += value;
    output.textContent = buffer;
  }
  calculating = false;
  output.style.fontSize = '1.9rem';
}

function handleMath(value) {
  if (output.textContent === '') {
    return;
  }

  smallText.textContent = value;
  if (initialValue !== 0 && input.textContent === '') {
    initialValue = +buffer;
    finalValue = +buffer;
    output.textContent = initialValue;
    input.textContent = `${finalValue}`;
    input.appendChild(smallText);
  } else if (initialValue === 0) {
    initialValue = +buffer;
    finalValue = +buffer;
    output.textContent = initialValue;
    input.textContent = `${finalValue}`;
    input.appendChild(smallText);
  } else if (calculating) {
    output.textContent = `${initialValue}`;
  } else {
    flushOperation(+buffer);
  }

  input.textContent = `${initialValue}`;
  input.appendChild(smallText);
  operator = value;
  buffer = '0';
  calculating = true;
  finalValue = initialValue;
}

function flushOperation(value) {
  if (isNaN(initialValue)) {
    buffer = '0';
    initialValue = 0;
    finalValue = 0;
    operator = null;
    calculating = true;
    input.textContent = '';
    output.textContent = buffer;
    return;
  } else if (operator === null) {
    input.textContent = `${buffer}=`;
  } else if (!calculating && input.textContent === '') {
    buffer = '';
    initialValue = value;
    input.textContent = `${initialValue}${operator}${finalValue}=`;
  } else if (!calculating && buffer === '') {
    // Do nothing
  } else if (!calculating) {
    finalValue = value;
    calculating = true;
  } else if (buffer === '0') {
    input.textContent = `${initialValue}${operator}${finalValue}=`;
  } else if (buffer !== '0') {
    input.textContent = `${initialValue}${operator}${finalValue}=`;
  } else {
    initialValue = value;
    input.textContent = `${initialValue}${operator}${finalValue}=`;
  }
  if (operator === '+') {
    if (input.textContent.includes('=')) {
      input.textContent = `${initialValue}${operator}${finalValue}=`;
      if (!Number.isInteger(initialValue) && !Number.isInteger(finalValue)) {
        initialValue = (initialValue * 10 + finalValue * 10) / 10;
      } else {
        initialValue += finalValue;
      }
    } else {
      input.textContent += `${finalValue}=`;
      if (!Number.isInteger(initialValue) && !Number.isInteger(finalValue)) {
        initialValue = (initialValue * 10 + finalValue * 10) / 10;
      } else {
        initialValue += finalValue;
      }
    }
    output.textContent = `${initialValue}`;
    if (output.textContent.length > 15) {
      initialValue = initialValue.toExponential();
      output.textContent = `${initialValue}`;
      output.style.fontSize = '1.3rem';
      initialValue = +initialValue;
    }
  } else if (operator === '-') {
    if (input.textContent.includes('=')) {
      input.textContent = `${initialValue}${operator}${finalValue}=`;
      if (!Number.isInteger(initialValue) && !Number.isInteger(finalValue)) {
        initialValue = (initialValue * 10 - finalValue * 10) / 10;
      } else {
        initialValue -= finalValue;
      }
    } else {
      input.textContent += `${finalValue}=`;
      if (!Number.isInteger(initialValue) && !Number.isInteger(finalValue)) {
        initialValue = (initialValue * 10 - finalValue * 10) / 10;
      } else {
        initialValue -= finalValue;
      }
    }
    output.textContent = `${initialValue}`;
    if (output.textContent.length > 15) {
      initialValue = initialValue.toExponential();
      output.textContent = `${initialValue}`;
      output.style.fontSize = '1.3rem';
      initialValue = +initialValue;
    }
  } else if (operator === 'x') {
    if (input.textContent.includes('=')) {
      input.textContent = `${initialValue}${operator}${finalValue}=`;
      if (!Number.isInteger(initialValue) && !Number.isInteger(finalValue)) {
        initialValue = (initialValue * 10 * finalValue * 10) / 10;
      } else {
        initialValue *= finalValue;
      }
    } else {
      input.textContent += `${finalValue}=`;
      if (!Number.isInteger(initialValue) && !Number.isInteger(finalValue)) {
        initialValue = (initialValue * 10 * finalValue * 10) / 10;
      } else {
        initialValue *= finalValue;
      }
    }
    output.textContent = `${initialValue}`;
    if (output.textContent.length > 15) {
      initialValue = initialValue.toExponential();
      output.textContent = `${initialValue}`;
      output.style.fontSize = '1.3rem';
      initialValue = +initialValue;
    }
  } else if (operator === '÷') {
    if (input.textContent.includes('=')) {
      input.textContent = `${initialValue}${operator}${finalValue}=`;
      if (!Number.isInteger(initialValue) && !Number.isInteger(finalValue)) {
        initialValue = (((initialValue * 10) / finalValue) * 10) / 100;
      } else {
        initialValue /= finalValue;
      }
    } else {
      input.textContent += `${finalValue}=`;
      if (!Number.isInteger(initialValue) && !Number.isInteger(finalValue)) {
        initialValue = (((initialValue * 10) / finalValue) * 10) / 100;
      } else {
        initialValue /= finalValue;
      }
    }
    if (isNaN(initialValue)) {
      input.textContent = `${buffer}${operator}`;
      output.textContent = 'Result is undefined';
      output.style.fontSize = '1.5rem';
    } else {
      output.textContent = `${initialValue}`;
      if (output.textContent.length > 15) {
        initialValue = initialValue.toExponential();
        output.textContent = `${initialValue}`;
        output.style.fontSize = '1.3rem';
        initialValue = +initialValue;
      }
    }
  }
}

// Function to render number to the screen
function handleNumber(value) {
  if (output.textContent === '') {
    return;
  }

  // Prevent input more than 15
  if (buffer.length === 15) {
    info.style.display = 'block';
    setTimeout(() => {
      info.style.display = 'none';
    }, 1000);
    return;
  }
  // End

  // Check if previous calculation has been done
  if (input.textContent.includes('=')) {
    input.textContent = '';
  }
  // End

  if (buffer === '0') {
    // If buffer is zero and operator is null, assign value to buffer
    buffer = value;
    output.textContent = buffer;
  } else if (calculating) {
    // Checks if buffer is not 0 and operator is not null, onclick of operator reset calculating to true
    buffer = value;
    output.textContent = buffer;
    return;
  } else {
    // If buffer is not zero and operator is null, concatenate value with buffer
    buffer += value;
    output.textContent = buffer;
  }

  // Resetting calculating back to false to continue concatenating if buffer is not 0
  calculating = false;
  output.style.fontSize = '1.9rem';
}
