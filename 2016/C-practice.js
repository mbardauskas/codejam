const _ = require('lodash');
const fs = require('fs');

const primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];

const nonTrivialDivisors = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...primeNumbers];

fs.readFile('./inputs/C-large-practice.in', 'utf8', (err, data) => {
  if (err) {
    console.log('Error reading file', err);
  }
  let dataArray = data.split('\n').filter(isNotEmpty);
  const testCount = dataArray.shift();
  const [coinLength, neededResults] = dataArray[0].split(' ');
  const coinRange = getCoinJamRangeInBinaries(coinLength);
  const preliminaryCoinJams = _.uniq(filterValidCoinJam(
    findBinariesInBetween(coinRange.start, coinRange.end, neededResults * 5)
  ));
  const validCoinJams = preliminaryCoinJams.filter(isValidCoinJam).slice(0, neededResults * 3);
  const output = getOutput(validCoinJams).slice(0, neededResults);
  console.log('Case #1:');
  console.log(output.slice(0, neededResults).join('\n'));
});

function getOutput(coinJams) {
  const output = [];
  coinJams.forEach(coinJam => {
    try {
      const divisors = [];
      for (let base = 2; base <= 10; base++) {
        const interpretation = Number(convertToBase(coinJam, base));
        const divisor = findDividablePrime(nonTrivialDivisors, divisors, interpretation);
        divisors.push(divisor);
      }
      const stringOfDivisors = divisors.join(' ');
      output.push(`${coinJam} ${stringOfDivisors}`);
    } catch (e) {
      // ignore
    }
  });

  return _.uniq(output);
}

function isValidCoinJam(coinJam) {
  let isValid = true;
  for (let base = 2; base <= 10; base++) {
    const interpretation = convertToBase(coinJam, base);
    if (isNumberPrime(interpretation)) {
      isValid = false;
      break;
    }
  }
  return isValid;
}

function isNumberPrime(numberUnderTest) {
  if (
    numberUnderTest == 1 ||
    numberUnderTest == 2 ||
    numberUnderTest == 3 ||
    numberUnderTest == 5 ||
    numberUnderTest == 7
  ) {
    return true;
  }

  /*
  const numberString = numberUnderTest.toString();
  if (
    numberString.endsWith('0') ||
    numberString.endsWith('2') ||
    numberString.endsWith('4') ||
    numberString.endsWith('5') ||
    numberString.endsWith('6') ||
    numberString.endsWith('8')
  ) {
    return false;
  }
  */
  if (isDivisibleByPrime(primeNumbers, numberUnderTest)) {
    return false;
  }

  // returning false positives too
  return true;
}

function isDivisibleByPrime(primeList, numberUnderTest) {
  const number = numberUnderTest;
  let isDivisible = false;
  for (let i = 0; i < primeList.length; i++) {
    console.log('### divide number by prime', number, primeList[i])
    if (number % primeList[i] === 0) {
      isDivisible = true;
      break;
    }
  }
  return isDivisible;
}

function findDividablePrime(primeList, usedPrimes, numberUnderTest) {
  const number = new Number(numberUnderTest);
  const usablePrimeList = _.without(primeList, ...usedPrimes);
  for (let i = usablePrimeList.length; i > 0; i--) {
    if (number % usablePrimeList[i] === 0 && number !== usablePrimeList[i]) {
      return usablePrimeList[i];
    }
  }
  throw new Error('no divisors');
}

function convertToBase(input, base) {
  const numbers = input.toString().split('');
  const zeroBasedLength = numbers.length-1;
  const base10 = _.reduce(numbers, (sum, digit, index) => {
    const power = (zeroBasedLength - index);
    const number = Math.pow(base, power) * digit;
    return sum + number;
  }, 0);
  return base10;
}

function isNotEmpty(input) {
  return input.toString().length > 0;
}

function getCoinJamRangeInBinaries(coinLength) {
  const start = [1];
  const end = [1];
  for (let i = 0; i < coinLength-2; i++) {
    start.push(0);
    end.push(1);
  }
  start.push(1);
  end.push(1);
  return {
    start: start.join(''),
    end: end.join(''),
  };
}

function findBinariesInBetween(startBinary, endBinary, sliceSize) {
  const allBinaries = [startBinary];
  const startDecimal = parseInt(startBinary, 2);
  const endDecimal = parseInt(endBinary, 2);
  const diff = Math.floor((endDecimal - startDecimal) / (sliceSize * 10));
  for (let i = startDecimal; i < endDecimal; i = i+diff) {
    allBinaries.push(i.toString(2));
  }
  allBinaries.push(endBinary);
  return allBinaries.slice(0, sliceSize);
}

function filterValidCoinJam(allBinaries) {
  return allBinaries.filter((binary) => {
    return binary.toString().startsWith('1') && binary.toString().endsWith('1');
  });
}

