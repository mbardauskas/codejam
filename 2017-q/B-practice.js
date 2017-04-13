// usage: node B-practice.js file.in > file.out

const _ = require('lodash');
const fs = require('fs');
const bigInteger = require('big-integer');

const thirdArg = process.argv[2];

fs.readFile(thirdArg, 'utf8', (err, data) => {
  if (err) {
    console.log('Error reading file', err);
  }
  let dataArray = data.split('\n').filter(isValidInput);
  const testCount = dataArray.shift();
  const resultArray = dataArray.map(getLastTidyNumber);
  _.map(resultArray, formatOutput);
});

function getLastTidyNumber(inputNoString) {
  const inputNo = bigInteger(inputNoString, 10);
  if (isTidyNumber(inputNo)) {
    return inputNo.toString();
  }

  const lastToInput = inputNo.minus(1);
  if (isTidyNumber(lastToInput)) {
    return lastToInput.toString();
  }

  if (inputNoString.endsWith('0')) {
    const zeroCount = inputNoString.length - _.trimEnd(inputNoString, '0').length;
    const decimalPoint = bigInteger(10).pow(zeroCount);
    return findLastTidyNumber(inputNo, decimalPoint);
  }

  return findLastTidyNumber(inputNo);
}

function findLastTidyNumber(digits, decimalPoint = bigInteger(10)) {
  if (decimalPoint.toString() > digits.toString()) {
    throw new Error('no tidy number??');
  }

  const potentialTidy = digits.minus(digits.divmod(decimalPoint).remainder).minus(1).toString();
  if (isTidyNumber(potentialTidy)) {
    return potentialTidy;
  }

  return findLastTidyNumber(digits, decimalPoint*10);
}

function isTidyNumber(inputNo) {
  const numbers = inputNo.toString().split('');
  let isTidy = true;

  for (let i = numbers.length; i > 0; i--) {
    if (i === 1) {
      isTidy = true;
      break;
    }
    if (i > 1 && numbers[i-1] < numbers[i-2]) {
      isTidy = false;
      break;
    }
  }

  return isTidy;
}

function formatOutput(output, arrayKey) {
  const index = arrayKey+1;
  console.log(`Case #${index}: ${output}`);
}

function isValidInput(input) {
  return input.toString().length > 0;
}


