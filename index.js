'use strict';
const buttons = document.querySelector('.buttons-container').children;
const output = document.querySelector('.output');
const input = document.querySelector('.input');
let buffer = '0';
let initialValue = 0;
let finalValue = 0;
let operator = null;
let calculating = true;

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

  console.log(
    'buffer',
    '==>',
    buffer,
    'initialValue',
    '==>',
    initialValue,
    'operator',
    '==>',
    operator,
    'calculating',
    '==>',
    calculating,
    'finalValue',
    '==>',
    finalValue
  );
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
    document.querySelector('.clear').textContent = 'OFF';
  } else {
    buffer = '0';
    initialValue = 0;
    finalValue = 0;
    operator = null;
    calculating = true;
    output.textContent = '';
    input.textContent = '';
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
  } else if (value === 'DEL') {
    if (initialValue !== 0) {
      input.textContent = '';
    } else if (calculating) {
      return;
    } else if (!calculating) {
      if (buffer.length === 1) {
        buffer = '0';
        output.textContent = buffer;
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

  if (buffer.includes(value)) {
    return;
  } else {
    buffer += value;
    output.textContent = buffer;
  }

  calculating = false;
}

function handleMath(value) {
  if (output.textContent === '') {
    return;
  }

  if (buffer.indexOf('.') === buffer.length - 1) {
    buffer = buffer.slice(0, -1);
  }

  if (buffer.length === 3 && buffer.includes('.') && buffer.slice(-1) === '0') {
    buffer = buffer.slice(0, -2);
  }

  if (initialValue === 0) {
    initialValue = +buffer;
    finalValue = +buffer;
    output.textContent = buffer;
    input.textContent = `${initialValue}${value}`;
  } else if (calculating) {
    output.textContent = `${initialValue}`;
  } else {
    flushOperation(+buffer);
  }

  input.textContent = `${initialValue}${value}`;
  operator = value;
  buffer = '0';
  calculating = true;
  finalValue = initialValue;
}

function flushOperation(value) {
  if (operator === '+') {
    if (!calculating) {
      finalValue = value;
    }
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
  } else if (operator === '-') {
    initialValue -= value;
    output.textContent = `${initialValue}`;
    input.textContent += `${value}=`;
  } else if (operator === 'x') {
    initialValue *= value;
    output.textContent = `${initialValue}`;
    input.textContent += `${value}=`;
  } else if (operator === '÷') {
    initialValue /= value;
    output.textContent = `${initialValue}`;
    input.textContent += `${value}=`;
  }
}

function handleNumber(value) {
  if (output.textContent === '') {
    return;
  }

  if (buffer === '0') {
    buffer = value;
    output.textContent = buffer;
  } else {
    buffer += value;
    output.textContent = buffer;
  }

  calculating = false;
}
