const output = document.querySelector('.output');
const result = document.querySelector('.result');
let buffer = '0';
let initialVal = 0;
let previousOperator;
const buttonsTexts = [
  '%',
  'ON',
  'C',
  'DEL',
  '1/x',
  'x²',
  '√x',
  '/',
  '7',
  '8',
  '9',
  'X',
  '4',
  '5',
  '6',
  '-',
  '1',
  '2',
  '3',
  '+',
  '+/-',
  '0',
  '.',
  '=',
];
function renderButtons(container) {
  for (let i = 0; i < 24; i++) {
    const button = document.createElement('button');
    container.appendChild(button);
    let buttonText = buttonsTexts.shift();
    button.textContent = buttonText;
    if (i === 1 || i === 2 || i === 3) {
      button.classList.add('clear');
    } else if (
      i === 0 ||
      i === 4 ||
      i === 5 ||
      i === 6 ||
      i === 7 ||
      i === 11 ||
      i === 15 ||
      i === 19 ||
      i === 20 ||
      i === 23
    ) {
      button.classList.add('operator');
    } else if (
      i === 8 ||
      i === 9 ||
      i === 10 ||
      i === 12 ||
      i === 13 ||
      i === 14 ||
      i === 16 ||
      i === 17 ||
      i === 18 ||
      i === 21
    ) {
      button.classList.add('number');
    } else if (i === 22) {
      button.classList.add('point');
    }
  }
}

// function handleUranary(value) {
//   if (buffer === undefined) {
//     return;
//   }

//   if (initialVal === 0) {
//     initialVal = Number(buffer);
//   } else {
//     initialVal = initialVal;
//   }

//   if (buffer === '0' && value === '1/x' && initialVal === 0) {
//     output.textContent = 'Cannot divide by zero';
//   } else if (value === '1/x') {
//     initialVal = 1 / initialVal;
//     output.textContent = initialVal;
//   } else if (value === 'x²') {
//     initialVal = initialVal ** 2;
//     output.textContent = initialVal;
//   } else if (value === '√x') {
//     initialVal = Math.sqrt(initialVal);
//     output.textContent = initialVal;
//   }

// }

// function handleMath(value) {
//   if (buffer === undefined) {
//     return;
//   }

//   let intBuffer = Number(buffer);
//   if (initialVal === 0) {
//     initialVal = intBuffer;
//   } else {
//     flushOperation(intBuffer);
//   }

//   previousOperator = value;
//   buffer = '0';
//   output.textContent = initialVal;
// }

// function flushOperation(intBuffer) {
//   if (previousOperator === '+') {
//     initialVal += intBuffer;
//   } else if (previousOperator === '-') {
//     initialVal -= intBuffer;
//   } else if (previousOperator === 'X') {
//     initialVal *= intBuffer;
//   } else if (previousOperator === '/') {
//     initialVal /= intBuffer;
//   }
// }

function powerOnAndOff(value) {
  if (value === 'ON') {
    buffer = '0';
    output.textContent = buffer;
    document.querySelector('.clear').textContent = 'OFF';
  } else if (value === 'OFF') {
    buffer = '0';
    output.textContent = '';
    document.querySelector('.clear').textContent = 'ON';
  }
}

function handlepoint(value) {
  if (output.textContent === '') {
    return;
  }
  if (buffer === '0') {
    buffer = `${buffer}${value}`;
    output.textContent = buffer;
  } else if (buffer.includes('.')) {
    return;
  } else {
    buffer += value;
    output.textContent = buffer;
  }
}

function handleClear(value) {
  if (output.textContent === '') {
    return;
  }
  if (value === 'C') {
    buffer = '0';
    output.textContent = buffer;
  } else if (value === 'DEL') {
    if (buffer.length === 1) {
      buffer = '0';
      output.textContent = buffer;
    } else {
      buffer = buffer.slice(0, -1);
      output.textContent = buffer;
    }
  }
}

function handleSpecialOperator(value) {
  if (output.textContent === '') {
    return;
  }
  if (value === '1/x') {
    if (buffer === '0') {
      output.textContent = 'Cannot divide by zero';
    } else {
      buffer = 1 / Number(buffer);
      buffer = buffer.toString();
      output.textContent = buffer;
    }
  } else if (value === 'x²') {
    buffer = Number(buffer) ** 2;
    buffer = buffer.toString();
    output.textContent = buffer;
  } else if (value === '√x') {
    buffer = Math.sqrt(Number(buffer));
    buffer = buffer.toString();
    output.textContent = buffer;
  }
}

function flushOperation(intBuffer) {
  if (previousOperator === '+') {
    initialVal += intBuffer;
    result.textContent = `(${initialVal})`;
  } else if (previousOperator === '-') {
    initialVal -= intBuffer;
    result.textContent = `(${initialVal})`;
  } else if (previousOperator === 'X') {
    initialVal *= intBuffer;
    result.textContent = `(${initialVal})`;
  } else if (previousOperator === '/') {
    initialVal /= intBuffer;
    result.textContent = `(${initialVal})`;
  }
}

function handleMath(value) {
  if (output.textContent === '') {
    return;
  }
  if (initialVal === 0) {
    initialVal = Number(buffer);
  } else {
    flushOperation(Number(buffer));
  }

  previousOperator = value;
  buffer = '0';
}

function handleSymbol(value) {
  switch (value) {
    case 'ON':
    case 'OFF':
      powerOnAndOff(value);
      break;
    case '.':
      handlepoint(value);
      break;
    case 'C':
    case 'DEL':
      handleClear(value);
      break;
    case '1/x':
    case 'x²':
    case '√x':
      handleSpecialOperator(value);
      break;
    case '/':
    case 'X':
    case '-':
    case '+':
      handleMath(value);
      break;
    case '=':
      if (previousOperator === null) {
        return;
      } else { 
        flushOperation(Number(buffer));
        previousOperator = null;
        buffer = initialVal;
        initialVal = 0;
        output.textContent = buffer;
      }
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
}

function buttonClick(value) {
  if (isNaN(value)) {
    handleSymbol(value);
    console.log(value, buffer);
  } else {
    handleNumber(value);
    console.log(value, buffer);
  }
}

function handleButton(e) {
  return buttonClick(e.target.textContent);
}

function init() {
  const buttonContainer = document.querySelector('.buttons-container');
  renderButtons(buttonContainer);
  buttonContainer.addEventListener('click', handleButton);
}

init();

// buttonsContainer.addEventListener('click', (e) => {
//   if (e.target.textContent === 'ON') {
//     output.textContent = buffer;
//     e.target.textContent = 'OFF';
//   } else if (e.target.textContent === 'OFF') {
//     output.textContent = '';
//     e.target.textContent = 'ON';
//   } else if (e.target.textContent === 'C' && output.textContent !== '') {
//     output.textContent = '0';
//   } else if (
//     e.target.textContent === 'DEL' &&
//     (output.textContent === '0' || output.textContent.length === 1)
//   ) {
//     output.textContent = '0';
//   } else if (e.target.textContent === 'DEL' && output.textContent.length > 1) {
//     output.textContent = output.textContent.slice(0, -1);
//   } else if (e.target.textContent === '1/x') {
//     if (output.textContent === '0') {
//       output.textContent = 'Cannot divide by zero';
//     } else {
//       output.textContent = 1 / Number(output.textContent);
//     }
//   } else if (e.target.textContent === 'x²') {
//     output.textContent = Number(output.textContent.replaceAll(',', '')) ** 2;
//   } else if (e.target.textContent === '√x') {
//     output.textContent = Math.sqrt(
//       Number(output.textContent.replaceAll(',', ''))
//     );
//   } else if (e.target.textContent === '+/-') {
// output.textContent = -Number(output.textContent);
//   } else if (
//     e.target.textContent === '0' ||
//     e.target.textContent === '1' ||
//     e.target.textContent === '2' ||
//     e.target.textContent === '3' ||
//     e.target.textContent === '4' ||
//     e.target.textContent === '5' ||
//     e.target.textContent === '6' ||
//     e.target.textContent === '7' ||
//     e.target.textContent === '8' ||
//     e.target.textContent === '9'
//   ) {
//     if (output.textContent === '') {
//       return;
//     } else if (output.textContent === '0') {
//       output.textContent = e.target.textContent;
//     } else {
//       output.textContent += e.target.textContent;
//     }
//   } else if (e.target.textContent === '/') {
//     sum = output.textContent;
//   }

//   // console.log(e.target.textContent, output.textContent);
// });

// function addComma() {
//   // let j = -1;
//   let array = [];
//   let length = output.textContent.length;
//   for (let i = length; i > 0; i--) {
//     let outputArray = output.textContent.split('');
//     console.log('outputArray', outputArray);
//     array.unshift(outputArray[i]);
//     console.log('array', array);

//     // outputArray.splice(-i, 0, ',');
//     // output.textContent = outputArray.join('');
//   }
// }
