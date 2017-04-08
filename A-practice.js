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
  const resultArray = _.map(pancakeSets, ({pancakes, flipperSize}) => sortPancakes(pancakes, flipperSize));
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

function sortPancakes(pancakeString, flipperSize) {
  if (!hasBlankSide(pancakeString)) {
    return 0;
  }

  const {flipCount, list} = flipPancakes(pancakeString, flipperSize);

  if (list.filter(isPlainSide).length > 0) {
    return INVALID_VALUE;
  }

  return flipCount;
}

function flipPancakes(pancakeString, flipperSize) {
  const pancakeList = pancakeString.split('').filter(isValidPancake);
  const result = _.reduce(
    pancakeList,
    (carry, val, key) => {
      let {flipCount, list} = carry;
      const currentPancake = list[key];
      if (isPlainSide(currentPancake) && isEasilyFlippableSlice(list, key, flipperSize)) {
        flipCount++;
        const flipped = getFlippableSlice(list, key, flipperSize).map(flipPancake);
        list.splice(key, flipperSize, ...flipped);
      }
      else if (isPlainSide(currentPancake) && isFixableWithTwoFlips(list, key, flipperSize)) {
        const thisSlice = getFlippableSlice(list, key, flipperSize);
        const lastPlainIndexInThisSlice = _.findLastIndex(thisSlice, isPlainSide);
        const plainPancakeCount = lastPlainIndexInThisSlice+1;
        const beginOfNextSlice = parseInt(key) + parseInt(flipperSize);
        const endOfNextSlice = beginOfNextSlice + plainPancakeCount;
        const nextSlice = list.slice(beginOfNextSlice, endOfNextSlice);
        const followedByPlainCount = nextSlice.filter(isPlainSide).length;
        const isFlippable = plainPancakeCount === followedByPlainCount;
        if (isFlippable) {
          flipCount = flipCount + 2;
          list.splice(key, endOfNextSlice, ...generateHappyPancakes(endOfNextSlice - key))
        }
      }
      return {flipCount, list};
    },
    {flipCount: 0, list: [...pancakeList]}
  );

  return result;
}

function generateHappyPancakes(count) {
  let pancakes = [];
  for (let i = 0; i < count; i++) {
    pancakes.push('+');
  }
  return pancakes;
}

function getFlippableSlice(list, key, flipperSize) {
  const begin = parseInt(key);
  const end = begin + parseInt(flipperSize);
  return list.slice(begin, end);
}

function isEasilyFlippableSlice(list, key, flipperSize) {
  const flippableSlice = getFlippableSlice(list, key, flipperSize);
  return flippableSlice.filter(isPlainSide).length === flipperSize;
}

function isFixableWithTwoFlips(list, key, flipperSize) {
  const thisSlice = getFlippableSlice(list, key, flipperSize);
  const lastPlainIndexInThisSlice = _.findLastIndex(thisSlice, isPlainSide);
  const plainPancakeCount = lastPlainIndexInThisSlice+1;
  const beginOfNextSlice = parseInt(key) + parseInt(flipperSize);
  const nextSlice = list.slice(beginOfNextSlice, beginOfNextSlice + plainPancakeCount);
  const followedByPlainCount = nextSlice.filter(isPlainSide).length;
  const isFlippable = plainPancakeCount === followedByPlainCount;
  return isFlippable;
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

