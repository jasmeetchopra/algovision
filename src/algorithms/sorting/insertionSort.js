export async function insertionSort(arr, { setArray, setHighlights, setStats, delay, waitIfPaused, shouldStop }) {
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sorted = new Set([0]);

  for (let i = 1; i < n; i++) {
    if (shouldStop()) return;
    let key = arr[i];
    let j = i - 1;

    setHighlights({ [i]: 'pivot', ...Object.fromEntries([...sorted].map(k => [k, 'sorted'])) });
    await delay();

    while (j >= 0 && arr[j] > key) {
      if (shouldStop()) return;
      await waitIfPaused();

      comparisons++;
      setHighlights({ [j]: 'comparing', [j + 1]: 'swapping', ...Object.fromEntries([...sorted].map(k => [k, 'sorted'])) });
      setStats(s => ({ ...s, comparisons }));
      await delay();

      arr[j + 1] = arr[j];
      swaps++;
      j--;
      setArray([...arr]);
      setStats(s => ({ ...s, swaps }));
    }

    arr[j + 1] = key;
    setArray([...arr]);
    sorted.add(i);
    setHighlights(Object.fromEntries([...sorted].map(k => [k, 'sorted'])));
    await delay();
  }
}
