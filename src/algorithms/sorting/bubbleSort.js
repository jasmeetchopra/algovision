export async function bubbleSort(arr, { setArray, setHighlights, setStats, delay, waitIfPaused, shouldStop }) {
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sorted = new Set();

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (shouldStop()) return;
      await waitIfPaused();

      comparisons++;
      setHighlights({ [j]: 'comparing', [j + 1]: 'comparing', ...Object.fromEntries([...sorted].map(k => [k, 'sorted'])) });
      setStats(s => ({ ...s, comparisons }));
      await delay();

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        setArray([...arr]);
        setHighlights({ [j]: 'swapping', [j + 1]: 'swapping', ...Object.fromEntries([...sorted].map(k => [k, 'sorted'])) });
        setStats(s => ({ ...s, swaps }));
        await delay();
      }
    }
    sorted.add(n - 1 - i);
    setHighlights(Object.fromEntries([...sorted].map(k => [k, 'sorted'])));
  }
  sorted.add(0);
  setHighlights(Object.fromEntries([...sorted].map(k => [k, 'sorted'])));
}
