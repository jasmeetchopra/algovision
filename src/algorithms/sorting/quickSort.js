export async function quickSort(arr, { setArray, setHighlights, setStats, delay, waitIfPaused, shouldStop }, left = 0, right = arr.length - 1, sorted = new Set()) {
  if (left >= right) {
    if (left === right) sorted.add(left);
    return;
  }
  if (shouldStop()) return;

  const pivotIdx = await partition(arr, left, right, { setArray, setHighlights, setStats, delay, waitIfPaused, shouldStop }, sorted);
  if (shouldStop()) return;

  sorted.add(pivotIdx);
  setHighlights(Object.fromEntries([...sorted].map(s => [s, 'sorted'])));

  await quickSort(arr, { setArray, setHighlights, setStats, delay, waitIfPaused, shouldStop }, left, pivotIdx - 1, sorted);
  if (shouldStop()) return;

  await quickSort(arr, { setArray, setHighlights, setStats, delay, waitIfPaused, shouldStop }, pivotIdx + 1, right, sorted);
}

async function partition(arr, left, right, { setArray, setHighlights, setStats, delay, waitIfPaused, shouldStop }, sorted) {
  // median-of-three pivot selection for better average performance
  const mid = Math.floor((left + right) / 2);
  if (arr[mid] < arr[left]) [arr[left], arr[mid]] = [arr[mid], arr[left]];
  if (arr[right] < arr[left]) [arr[left], arr[right]] = [arr[right], arr[left]];
  if (arr[mid] < arr[right]) [arr[mid], arr[right]] = [arr[right], arr[mid]];

  const pivot = arr[right];
  let i = left - 1;

  for (let j = left; j < right; j++) {
    if (shouldStop()) return i + 1;
    await waitIfPaused();

    setStats(s => ({ ...s, comparisons: s.comparisons + 1 }));
    setHighlights({
      ...Object.fromEntries([...sorted].map(s => [s, 'sorted'])),
      [right]: 'pivot',
      [j]: 'comparing',
      ...(i >= left ? { [i]: 'swapping' } : {}),
    });
    await delay();

    if (arr[j] <= pivot) {
      i++;
      if (i !== j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setStats(s => ({ ...s, swaps: s.swaps + 1 }));
        setArray([...arr]);
        setHighlights({
          ...Object.fromEntries([...sorted].map(s => [s, 'sorted'])),
          [right]: 'pivot',
          [i]: 'swapping',
          [j]: 'swapping',
        });
        await delay();
      }
    }
  }

  // place pivot in correct position
  const pivotPos = i + 1;
  if (pivotPos !== right) {
    [arr[pivotPos], arr[right]] = [arr[right], arr[pivotPos]];
    setStats(s => ({ ...s, swaps: s.swaps + 1 }));
    setArray([...arr]);
    setHighlights({
      ...Object.fromEntries([...sorted].map(s => [s, 'sorted'])),
      [pivotPos]: 'pivot',
    });
    await delay();
  }

  return pivotPos;
}
