
export async function mergeSort(
  arr,
  { setArray, setHighlights, setStats, delay, waitIfPaused, shouldStop, onMergeEvent },
  left = 0,
  right = arr.length - 1,
  sorted = new Set(),
  depth = 0
) {
  if (left > right) return;

  // Send current subarray values
  onMergeEvent?.({
    type: 'enter',
    left,
    right,
    depth,
    values: arr.slice(left, right + 1),
  });

  if (left >= right) {
    onMergeEvent?.({
      type: 'base',
      left,
      right,
      depth,
      values: arr.slice(left, right + 1),
    });

    sorted.add(left);
    return;
  }

  if (shouldStop()) return;

  const mid = Math.floor((left + right) / 2);

  const splitHl = {};

  for (let x = left; x <= right; x++) {
    splitHl[x] = 'active';
  }

  setHighlights({
    ...Object.fromEntries([...sorted].map(s => [s, 'sorted'])),
    ...splitHl,
  });

  await delay();

  if (shouldStop()) return;

  onMergeEvent?.({
    type: 'split',
    left,
    right,
    mid,
    depth,

    leftValues: arr.slice(left, mid + 1),
    rightValues: arr.slice(mid + 1, right + 1),
  });

  await mergeSort(
    arr,
    {
      setArray,
      setHighlights,
      setStats,
      delay,
      waitIfPaused,
      shouldStop,
      onMergeEvent,
    },
    left,
    mid,
    sorted,
    depth + 1
  );

  if (shouldStop()) return;

  await mergeSort(
    arr,
    {
      setArray,
      setHighlights,
      setStats,
      delay,
      waitIfPaused,
      shouldStop,
      onMergeEvent,
    },
    mid + 1,
    right,
    sorted,
    depth + 1
  );

  if (shouldStop()) return;

  onMergeEvent?.({
    type: 'mergeStart',
    left,
    mid,
    right,
    depth,
  });

  await merge(
    arr,
    left,
    mid,
    right,
    {
      setArray,
      setHighlights,
      setStats,
      delay,
      waitIfPaused,
      shouldStop,
    },
    sorted
  );

  if (!shouldStop()) {
    onMergeEvent?.({
      type: 'mergeDone',
      left,
      right,
      mid,
      depth,

      values: arr.slice(left, right + 1),
    });
  }
}

async function merge(
  arr,
  left,
  mid,
  right,
  {
    setArray,
    setHighlights,
    setStats,
    delay,
    waitIfPaused,
    shouldStop,
  },
  sorted
) {
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);

  let i = 0;
  let j = 0;
  let k = left;

  while (i < leftArr.length && j < rightArr.length) {
    if (shouldStop()) return;

    await waitIfPaused();

    const hi = {};

    for (let x = left; x <= right; x++) {
      hi[x] = 'active';
    }

    hi[left + i] = 'comparing';
    hi[mid + 1 + j] = 'swapping';

    setHighlights({
      ...Object.fromEntries([...sorted].map(s => [s, 'sorted'])),
      ...hi,
    });

    setStats(s => ({
      ...s,
      comparisons: s.comparisons + 1,
    }));

    await delay();

    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i];
      i++;
    } else {
      arr[k] = rightArr[j];
      j++;

      setStats(s => ({
        ...s,
        swaps: s.swaps + 1,
      }));
    }

    setArray([...arr]);

    k++;
  }

  while (i < leftArr.length) {
    if (shouldStop()) return;

    arr[k] = leftArr[i];

    setArray([...arr]);

    i++;
    k++;

    await delay();
  }

  while (j < rightArr.length) {
    if (shouldStop()) return;

    arr[k] = rightArr[j];

    setArray([...arr]);

    j++;
    k++;

    await delay();
  }

  for (let x = left; x <= right; x++) {
    sorted.add(x);
  }

  setHighlights(
    Object.fromEntries(
      [...sorted].map(s => [s, 'sorted'])
    )
  );
}