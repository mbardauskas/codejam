// usage: node C-practice.js file.in > file.out

const _ = require('lodash');
const fs = require('fs');

const thirdArg = process.argv[2];

fs.readFile(thirdArg, 'utf8', (err, data) => {
  if (err) {
    console.log('Error reading file', err);
  }
  let dataArray = data.split('\n').filter(isValidInput);
  const testCount = dataArray.shift();
  const resultArray = dataArray.map(getStallMaxMin);
  const formattedOutput = resultArray.map(formatOutput);
  _.map(formattedOutput, printOutput);
});

const FILLED_STALL = 'O';
const EMPTY_STALL = '.';

class StallSegmentQueue {
  constructor(initialItems = []) {
    this.queue = {}
    initialItems.forEach(item => {
      if (this.queue[item]) {
        this.queue[item] = this.queue[item] + 1;
      } else {
        this.queue[item] = 1;
      }
    });
  }

  addItems(items) {
    items.forEach((item) => {
      if (this.queue[item]) {
        this.queue[item] = this.queue[item] + 1;
      } else {
        this.queue[item] = 1;
      }
    });
  }

  getFirstItem() {
    const biggestValue = _.max(Object.keys(this.queue).map(item => parseInt(item)));
    const result = {
      stallCount: biggestValue,
    };
    if (this.queue[biggestValue] > 1) {
      const newValue = this.queue[biggestValue] - 1;
      result.queueCount = newValue;
      this.queue[biggestValue] = newValue;
    }

    if (this.queue[biggestValue] === 1) {
      result.queueCount = this.queue[biggestValue];
      delete this.queue[biggestValue];
    }

    return result;
  }

  getLastItems() {
    const lastItemIndex = this.queue.length-1;
    const secondToLastItemIndex = lastItemIndex-1;
    const maxLeft = this.queue[secondToLastItemIndex]
    const maxRight = this.queue[lastItemIndex]
    return [maxLeft, maxRight];
  }
}

function hasMaxMoreThanOne(maxValues) {
  return maxValues.length === 0 || (maxValues.length > 0 && Math.max(...maxValues) > 0);
}

function getResult(stallSegmentQueue, peopleCount) {
  let maxValues = [];

  while (peopleCount > 1 && hasMaxMoreThanOne(maxValues)) {
    mutationResult = mutateQueueAndGetMaxValues(stallSegmentQueue);
    maxValues = [mutationResult.maxLeft, mutationResult.maxRight];
    peopleCount = peopleCount-mutationResult.affectedQueueCount;
  }

  return {
    min: Math.min(...maxValues),
    max: Math.max(...maxValues),
  };
}

function mutateQueueAndGetMaxValues(stallSegmentQueue) {
  const queueItem = stallSegmentQueue.getFirstItem();
  const affectedQueueCount = queueItem.queueCount;
  const {maxLeft, maxRight} = getMaxLeftRightForCurrentStall(queueItem.stallCount);
  const nextAvailableStalllSegments = [];
  if (maxLeft > 0) {
    nextAvailableStalllSegments.push(maxLeft);
  }
  if (maxRight > 0) {
    nextAvailableStalllSegments.push(maxRight);
  }
  if (nextAvailableStalllSegments.length > 1) {
    stallSegmentQueue.addItems(
      [Math.max(...nextAvailableStalllSegments), Math.min(...nextAvailableStalllSegments)]
    );
  }
  if (nextAvailableStalllSegments.length === 1) {
    stallSegmentQueue.addItems(nextAvailableStalllSegments);
  }

  return {
    maxLeft, maxRight, affectedQueueCount,
  };
}

function getStallMaxMin(data, dataKey) {
  const [N, K] = data.split(' ');
  const stallCount = parseInt(N);
  const peopleCount = parseInt(K);

  if (peopleCount === stallCount) {
    return {max: 0, min: 0};
  }

  if (peopleCount === 1) {
    return {min: Math.ceil(stallCount / 2) - 1, max: Math.floor(stallCount / 2)};
  }

  const {maxLeft, maxRight} = getMaxLeftRightForCurrentStall(stallCount);
  const stallSegmentQueue = new StallSegmentQueue(
    [Math.max(maxLeft, maxRight), Math.min(maxLeft, maxRight)],
    peopleCount - 1
  );

  const res = getResult(stallSegmentQueue, peopleCount);
  return res;
}

function getMaxLeftRightForCurrentStall(stallCount) {
  const halfStalls = Math.ceil(stallCount / 2);
  let maxLeft = halfStalls;
  let maxRight = stallCount - halfStalls;
  maxLeft >= maxRight ? maxLeft -= 1 : maxRight -= 1;
  return {maxLeft, maxRight};
}

function formatOutput(data) {
  const {max, min} = data;
  return `${max} ${min}`;
}

function printOutput(output, arrayKey) {
  const index = arrayKey+1;
  console.log(`Case #${index}: ${output}`);
}

function isValidInput(input) {
  return input.toString().length > 0;
}


