function generateBubbleSortFrames(initialArray) {
  const arr = [...initialArray];
  const n = arr.length;
  const frames = [];
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  const sortedIndices = [];

  // Initial Frame
  frames.push({
    array: [...arr],
    auxArray: null,
    highlights: {},
    pointers: [],
    comparisons,
    swaps,
    accesses,
    pseudocodeLine: 1,
    explanation: `Starting Bubble Sort on array of ${n} elements.`,
    sortedIndices: [...sortedIndices],
    activeRange: [0, n - 1]
  });

  for (let i = 0; i < n; i++) {
    let swapped = false;
    frames.push({
      array: [...arr],
      auxArray: null,
      highlights: {},
      pointers: [{ index: 0, label: `Pass ${i + 1}`, color: "purple" }],
      comparisons,
      swaps,
      accesses,
      pseudocodeLine: 3,
      explanation: `Outer Loop: Pass ${i + 1} of ${n}. Floating the largest unsorted element to index ${n - 1 - i}.`,
      sortedIndices: [...sortedIndices],
      activeRange: [0, n - 1 - i]
    });

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      accesses += 2;

      // Comparing frame
      const isGreater = arr[j] > arr[j + 1];
      frames.push({
        array: [...arr],
        auxArray: null,
        highlights: {
          [j]: "comparing",
          [j + 1]: "comparing"
        },
        pointers: [
          { index: j, label: "j", color: "amber" },
          { index: j + 1, label: "j+1", color: "cyan" }
        ],
        comparisons,
        swaps,
        accesses,
        pseudocodeLine: 6,
        explanation: `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}). ${isGreater ? `${arr[j]} > ${arr[j + 1]} → Needs Swap!` : `${arr[j]} ≤ ${arr[j + 1]} → In correct order.`}`,
        sortedIndices: [...sortedIndices],
        activeRange: [0, n - 1 - i]
      });

      if (isGreater) {
        // Swap
        swaps++;
        accesses += 4;
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;

        frames.push({
          array: [...arr],
          auxArray: null,
          highlights: {
            [j]: "swapping",
            [j + 1]: "swapping"
          },
          pointers: [
            { index: j, label: "j", color: "rose" },
            { index: j + 1, label: "j+1", color: "rose" }
          ],
          comparisons,
          swaps,
          accesses,
          pseudocodeLine: 7,
          explanation: `Swapped arr[${j}] (${arr[j]}) with arr[${j + 1}] (${arr[j + 1]}).`,
          sortedIndices: [...sortedIndices],
          activeRange: [0, n - 1 - i]
        });
      }
    }

    // Element at n - 1 - i is now permanently in sorted position
    sortedIndices.push(n - 1 - i);
    frames.push({
      array: [...arr],
      auxArray: null,
      highlights: {
        [n - 1 - i]: "sorted"
      },
      pointers: [{ index: n - 1 - i, label: "Fixed", color: "emerald" }],
      comparisons,
      swaps,
      accesses,
      pseudocodeLine: 3,
      explanation: `Element ${arr[n - 1 - i]} at index ${n - 1 - i} is now locked in its sorted position.`,
      sortedIndices: [...sortedIndices],
      activeRange: [0, n - 2 - i]
    });

    if (!swapped) {
      // Early exit triggered
      for (let k = 0; k < n; k++) {
        if (!sortedIndices.includes(k)) sortedIndices.push(k);
      }
      frames.push({
        array: [...arr],
        auxArray: null,
        highlights: {},
        pointers: [],
        comparisons,
        swaps,
        accesses,
        pseudocodeLine: 9,
        explanation: `Early Termination Optimization: No swaps occurred in pass ${i + 1}. The array is already completely sorted (Best Case O(n))!`,
        sortedIndices: [...sortedIndices],
        activeRange: null
      });
      break;
    }
  }

  // Final sorted frame
  for (let k = 0; k < n; k++) {
    if (!sortedIndices.includes(k)) sortedIndices.push(k);
  }
  frames.push({
    array: [...arr],
    auxArray: null,
    highlights: {},
    pointers: [],
    comparisons,
    swaps,
    accesses,
    pseudocodeLine: 10,
    explanation: `Bubble Sort Complete! Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
    sortedIndices: [...sortedIndices],
    activeRange: null
  });

  return frames;
}

/**
 * Selection Sort Frame Generator
 */
