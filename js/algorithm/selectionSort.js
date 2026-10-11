function generateSelectionSortFrames(initialArray) {
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
    pointers: [],
    comparisons,
    swaps,
    accesses,
    pseudocodeLine: 1,
    explanation: `Starting Selection Sort on array of ${n} elements.`,
    sortedIndices: [...sortedIndices],
    activeRange: [0, n - 1]
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    accesses++;

    frames.push({
      array: [...arr],
      auxArray: null,
      highlights: { [minIdx]: "selected" },
      pointers: [
        { index: i, label: "i (target)", color: "purple" },
        { index: minIdx, label: "min", color: "amber" }
      ],
      comparisons,
      swaps,
      accesses,
      pseudocodeLine: 4,
      explanation: `Pass ${i + 1}: Searching for minimum element in unsorted subarray [${i}...${n - 1}]. Initial min is arr[${i}] = ${arr[i]}.`,
      sortedIndices: [...sortedIndices],
      activeRange: [i, n - 1]
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      accesses += 2;
      const isSmaller = arr[j] < arr[minIdx];

      frames.push({
        array: [...arr],
        auxArray: null,
        highlights: {
          [minIdx]: "selected",
          [j]: "comparing"
        },
        pointers: [
          { index: i, label: "i", color: "purple" },
          { index: minIdx, label: "min", color: "amber" },
          { index: j, label: "j", color: "cyan" }
        ],
        comparisons,
        swaps,
        accesses,
        pseudocodeLine: 6,
        explanation: `Comparing arr[${j}] (${arr[j]}) with current minimum arr[${minIdx}] (${arr[minIdx]}). ${isSmaller ? `New minimum found: ${arr[j]} < ${arr[minIdx]}!` : `Not smaller than current minimum.`}`,
        sortedIndices: [...sortedIndices],
        activeRange: [i, n - 1]
      });

      if (isSmaller) {
        minIdx = j;
        frames.push({
          array: [...arr],
          auxArray: null,
          highlights: { [minIdx]: "selected" },
          pointers: [
            { index: i, label: "i", color: "purple" },
            { index: minIdx, label: "new min", color: "emerald" }
          ],
          comparisons,
          swaps,
          accesses,
          pseudocodeLine: 7,
          explanation: `Updated minimum index: min_idx = ${minIdx} (Value: ${arr[minIdx]}).`,
          sortedIndices: [...sortedIndices],
          activeRange: [i, n - 1]
        });
      }
    }

    if (minIdx !== i) {
      swaps++;
      accesses += 4;
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      frames.push({
        array: [...arr],
        auxArray: null,
        highlights: {
          [i]: "swapping",
          [minIdx]: "swapping"
        },
        pointers: [
          { index: i, label: "swapped min", color: "rose" },
          { index: minIdx, label: "old pos", color: "rose" }
        ],
        comparisons,
        swaps,
        accesses,
        pseudocodeLine: 9,
        explanation: `Swapped minimum element ${arr[i]} into its sorted index ${i}.`,
        sortedIndices: [...sortedIndices],
        activeRange: [i, n - 1]
      });
    } else {
      frames.push({
        array: [...arr],
        auxArray: null,
        highlights: { [i]: "selected" },
        pointers: [{ index: i, label: "already min", color: "emerald" }],
        comparisons,
        swaps,
        accesses,
        pseudocodeLine: 8,
        explanation: `Minimum element is already at index ${i} (${arr[i]}). No swap required.`,
        sortedIndices: [...sortedIndices],
        activeRange: [i, n - 1]
      });
    }

    sortedIndices.push(i);
  }

  // The last remaining element is automatically sorted
  sortedIndices.push(n - 1);
  frames.push({
    array: [...arr],
    auxArray: null,
    highlights: {},
    pointers: [],
    comparisons,
    swaps,
    accesses,
    pseudocodeLine: 10,
    explanation: `Selection Sort Complete! Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
    sortedIndices: [...sortedIndices],
    activeRange: null
  });

  return frames;
}

/**
 * Insertion Sort Frame Generator
 */
