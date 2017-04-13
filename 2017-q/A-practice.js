const _ = require('lodash');
const fs = require('fs');

const thirdArg = process.argv[2];

fs.readFile(thirdArg, 'utf8', (err, data) => {
  if (err) {
    console.log('Error reading file', err);
  }
  let dataArray = data.split('\n').filter(isValidInput);
  const testCount = dataArray.shift();
  const pancakeSets = _.map(dataArray, (dataSet) => {
    const [pancakes, flipperSize] = dataSet.split(' ');
    return {pancakes, flipperSize: parseInt(flipperSize)};
  });
  const resultArray = _.map(pancakeSets, ({pancakes, flipperSize}, key) => sortPancakes(pancakes, flipperSize, key));
  _.map(resultArray, formatOutput);
});

function formatOutput(output, arrayKey) {
  const index = arrayKey+1;
  console.log(`Case #${index}: ${output}`);
}

function isValidInput(input) {
  return input.toString().length > 0;
}

const INVALID_VALUE = 'IMPOSSIBLE';

function sortPancakes(pancakeString, flipperSize, key) {
  if (!hasBlankSide(pancakeString)) {
    return 0;
  }

  return getFlipCountOrInvalid(pancakeString, parseInt(flipperSize));
}

function getFlipCountOrInvalid(pancakes, flipperSize) {
  let flipCount = 0;
  let pancakeString = pancakes;

  try {
    while(hasBlankSide(pancakeString)) {
      pancakeString = flipPancakes(pancakeString, flipperSize);
      flipCount++;
    }
  } catch (e) {
    return INVALID_VALUE;
  }

  return flipCount;
}

function flipPancakes(pancakes, flipperSize) {
  const firstBlankIndex = pancakes.indexOf('-');
  const lastFlippableIndex = firstBlankIndex+flipperSize;
  const pancakeSetLength = pancakes.length;

  if (firstBlankIndex + flipperSize > pancakeSetLength) {
    throw new Error('impossible');
  }

  const flippedPancakes = _.map(
    pancakes.substring(firstBlankIndex, lastFlippableIndex).split(''),
    flipPancake
  );

  const flippedString = flippedPancakes.join('');

  return pancakes.substring(0, firstBlankIndex) + flippedString + pancakes.substring(lastFlippableIndex);
}

function hasBlankSide(pancakeString) {
  return !!pancakeString.match(/-/g);
}

function isValidPancake(pancake) {
  return pancake === '+' || pancake === '-';
}

function isPlainSide(pancake) {
  return pancake === '-';
}

function flipPancake(pancake) {
  return pancake === '-' ? '+' : '-';
}

