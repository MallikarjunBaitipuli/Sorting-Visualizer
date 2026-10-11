function generateQuickSortFrames(initialArray) {
  const arr = [...initialArray];
  const n = arr.length;
  const frames = [];
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  const sortedIndices = [];

  frames.push({
    array: [...arr],
    auxArray: null,
    highlights: {},
    pointers: [{ index: 0, label: "low=0", color: "blue" }, { index: n - 1, label: `high=${n - 1}`, color: "blue" }],
    comparisons,
    swaps,
    accesses,
    pseudocodeLine: 1,
    explanation: `Starting Quick Sort on array of ${n} elements.`,
    sortedIndices: [...sortedIndices],
    activeRange: [0, n - 1]
  });

  function quickSortHelper(low, high) {
    if (low < high) {
      const p = partition(low, high);
      quickSortHelper(low, p - 1);
      quickSortHelper(p + 1, high);
    } else if (low === high) {
      if (!sortedIndices.includes(low)) sortedIndices.push(low);
    }
  }

  function partition(low, high) {
    const pivot = arr[high];
    accesses++;
    let i = low - 1;

    frames.push({
      array: [...arr],
      auxArray: null,
      highlights: { [high]: "pivot" },
      pointers: [
        { index: high, label: `pivot = ${pivot}`, color: "purple" },
        { index: low, label: "low", color: "blue" },
        { index: high, label: "high", color: "blue" }
      ],
      comparisons,
      swaps,
      accesses,
      pseudocodeLine: 8,
      explanation: `Partitioning subarray [${low}...${high}]. Chosen pivot: arr[${high}] = ${pivot}. Partition boundary i starts at ${i}.`,
      sortedIndices: [...sortedIndices],
      activeRange: [low, high]
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      accesses++;
      const isSmallerOrEqual = arr[j] <= pivot;

      frames.push({
        array: [...arr],
        auxArray: null,
        highlights: {
          [j]: "comparing",
          [high]: "pivot"
        },
        pointers: [
          ...(i >= low ? [{ index: i, label: "i (boundary)", color: "cyan" }] : []),
          { index: j, label: "j (scan)", color: "amber" },
          { index: high, label: "pivot", color: "purple" }
        ],
        comparisons,
        swaps,
        accesses,
        pseudocodeLine: 10,
        explanation: `Comparing arr[${j}] (${arr[j]}) with pivot (${pivot}). ${isSmallerOrEqual ? `${arr[j]} ≤ ${pivot} → Increment boundary i and swap arr[i] with arr[j].` : `${arr[j]} > ${pivot} → Belongs in right partition; advance j.`}`,
        sortedIndices: [...sortedIndices],
        activeRange: [low, high]
      });

      if (isSmallerOrEqual) {
        i++;
        if (i !== j) {
          swaps++;
          accesses += 4;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          frames.push({
            array: [...arr],
            auxArray: null,
            highlights: {
              [i]: "swapping",
              [j]: "swapping",
              [high]: "pivot"
            },
            pointers: [
              { index: i, label: "i", color: "rose" },
              { index: j, label: "j", color: "rose" },
              { index: high, label: "pivot", color: "purple" }
            ],
            comparisons,
            swaps,
            accesses,
            pseudocodeLine: 10,
            explanation: `Swapped arr[${i}] (${arr[i]}) with arr[${j}] (${arr[j]}) to keep elements ≤ pivot on the left.`,
            sortedIndices: [...sortedIndices],
            activeRange: [low, high]
          });
        }
      }
    }

    // Place pivot in its final sorted position
    swaps++;
    accesses += 4;
    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    const pivotIndex = i + 1;

    sortedIndices.push(pivotIndex);

    frames.push({
      array: [...arr],
      auxArray: null,
      highlights: { [pivotIndex]: "sorted" },
      pointers: [{ index: pivotIndex, label: `pivot fixed at ${pivotIndex}`, color: "emerald" }],
      comparisons,
      swaps,
      accesses,
      pseudocodeLine: 11,
      explanation: `Placed pivot (${pivot}) at its correct final index ${pivotIndex}. Left subarray < ${pivot}, Right subarray ≥ ${pivot}.`,
      sortedIndices: [...sortedIndices],
      activeRange: [low, high]
    });

    return pivotIndex;
  }

  quickSortHelper(0, n - 1);

  for (let idx = 0; idx < n; idx++) {
    if (!sortedIndices.includes(idx)) sortedIndices.push(idx);
  }

  frames.push({
    array: [...arr],
    auxArray: null,
    highlights: {},
    pointers: [],
    comparisons,
    swaps,
    accesses,
    pseudocodeLine: 5,
    explanation: `Quick Sort Complete! Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
    sortedIndices: [...sortedIndices],
    activeRange: null
  });

  return frames;
}

/**
 * Heap Sort Frame Generator (Max-Heapify based)
 */
