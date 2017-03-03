const _ = require('lodash');
const fs = require('fs');

function findOutput(inputNo, index) {
  let allNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const limit = 100;

  for (let i = 1; i <= limit; i++) {
    const curNo = inputNo * i;
    const digitArray = curNo.toString().split('').map(Number);

    allNumbers = _.without(allNumbers, ...digitArray);

    if (allNumbers.length === 0) {
      console.log(`Case #${index+1}: ${curNo}`);
      break;
    }
  }

  if (allNumbers.length > 0) {
    console.log(`Case #${index+1}: INSOMNIA`);
  }
}

fs.readFile('A-large-practice.in', 'utf8', (err, data) => {
  if (err) {
    console.log('Error reading file', err);
  }
  let dataArray = data.split('\n').filter(isValidInput).map(Number);
  const testCount = dataArray.shift();
  dataArray.map(findOutput);
});

function isValidInput(input) {
  return input.toString().length > 0;
}
