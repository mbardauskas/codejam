const _ = require('lodash');
const fs = require('fs');

function sortPancakes(data, index) {
  const pancakeList = data.split('').filter(isValidPancake);
  const reversedList = _.reverse(pancakeList);
  const list = _.reduce(reversedList, (carry, initialPancake, key) => {
    let {list, invertCount} = carry;
    const pancake = list[key];
    if (isPlainSide(pancake)) {
      if (key == 0) {
        list = list.map(invertPancake);
        invertCount++;
      } else {
        const goodPancakes = list.slice(0, key);
        const badPancakes = list.slice(key);
        list = [...goodPancakes, ...badPancakes.map(invertPancake)];
        invertCount++;
      }
    }
    return {
      list, invertCount
    };
  }, {invertCount: 0, list: [...reversedList]});
  formatOutput(index+1, list.invertCount);
}

function isPlainSide(pancake) {
  return pancake === '-';
}

function isValidPancake(pancake) {
  return pancake === '+' || pancake === '-';
}

function invertPancake(pancake) {
  return pancake === '-' ? '+' : '-';
}

fs.readFile('./inputs/B-large-practice.in', 'utf8', (err, data) => {
  if (err) {
    console.log('Error reading file', err);
  }
  let dataArray = data.split('\n').filter(isValidInput);
  const testCount = dataArray.shift();
  dataArray.map(sortPancakes);
});

function formatOutput(index, output) {
  console.log(`Case #${index}: ${output}`);
}

function isValidInput(input) {
  return input.toString().length > 0;
}

