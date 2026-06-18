export async function selectionSort(arr, { setArray, setHighlights, setStats, delay, waitIfPaused, shouldStop }) {
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sorted = new Set();

  for (let i = 0; i < n - 1; i++) {
    if (shouldStop()) return;
    let minIdx = i;

    setHighlights({ [i]: 'pivot', ...Object.fromEntries([...sorted].map(k => [k, 'sorted'])) });
    await delay();

    for (let j = i + 1; j < n; j++) {
      if (shouldStop()) return;
      await waitIfPaused();

      comparisons++;
      setHighlights({ [minIdx]: 'pivot', [j]: 'comparing', ...Object.fromEntries([...sorted].map(k => [k, 'sorted'])) });
      setStats(s => ({ ...s, comparisons }));
      await delay();

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swaps++;
      setArray([...arr]);
      setHighlights({ [i]: 'swapping', [minIdx]: 'swapping', ...Object.fromEntries([...sorted].map(k => [k, 'sorted'])) });
      setStats(s => ({ ...s, swaps }));
      await delay();
    }

    sorted.add(i);
    setHighlights(Object.fromEntries([...sorted].map(k => [k, 'sorted'])));
  }
  sorted.add(n - 1);
  setHighlights(Object.fromEntries([...sorted].map(k => [k, 'sorted'])));
}
