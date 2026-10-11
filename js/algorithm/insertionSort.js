function generateInsertionSortFrames(initialArray) {
  const arr = [...initialArray];
  const n = arr.length;
  const frames = [];
  let comparisons = 0;
  let swaps = 0; // In insertion sort, treated as shifts / writes
  let accesses = 0;
  const sortedIndices = [0];

  frames.push({
    array: [...arr],
    auxArray: null,
    highlights: { 0: "sorted" },
    pointers: [{ index: 0, label: "sorted prefix", color: "emerald" }],
    comparisons,
    swaps,
    accesses: accesses + 1,
    pseudocodeLine: 1,
    explanation: `Starting Insertion Sort. Initial single-element subarray [0] (${arr[0]}) is already trivially sorted.`,
    sortedIndices: [...sortedIndices],
    activeRange: [0, 0]
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    accesses++;
    let j = i - 1;

    frames.push({
      array: [...arr],
      auxArray: null,
      highlights: { [i]: "pivot" },
      pointers: [{ index: i, label: `key = ${key}`, color: "purple" }],
      comparisons,
      swaps,
      accesses,
      pseudocodeLine: 4,
      explanation: `Step ${i}: Selected key = ${key} at index ${i}. Finding its insertion position in sorted prefix [0...${i - 1}].`,
      sortedIndices: [...sortedIndices],
      activeRange: [0, i]
    });

    while (j >= 0) {
      comparisons++;
      accesses++;
      const isGreater = arr[j] > key;

      frames.push({
        array: [...arr],
        auxArray: null,
        highlights: {
          [j]: "comparing",
          [j + 1]: "pivot"
        },
        pointers: [
          { index: j, label: "j", color: "amber" },
          { index: j + 1, label: "shift slot", color: "purple" }
        ],
        comparisons,
        swaps,
        accesses,
        pseudocodeLine: 6,
        explanation: `Comparing prefix element arr[${j}] (${arr[j]}) with key (${key}). ${isGreater ? `${arr[j]} > ${key} → Shift ${arr[j]} right!` : `${arr[j]} ≤ ${key} → Correct insertion spot found.`}`,
        sortedIndices: [...sortedIndices],
        activeRange: [0, i]
      });

      if (isGreater) {
        swaps++; // Shift write
        accesses += 2;
        arr[j + 1] = arr[j];

        frames.push({
          array: [...arr],
          auxArray: null,
          highlights: {
            [j + 1]: "swapping"
          },
          pointers: [
            { index: j + 1, label: `shifted ${arr[j + 1]}`, color: "rose" }
          ],
          comparisons,
          swaps,
          accesses,
          pseudocodeLine: 7,
          explanation: `Shifted arr[${j}] (${arr[j + 1]}) right to index ${j + 1}.`,
          sortedIndices: [...sortedIndices],
          activeRange: [0, i]
        });

        j = j - 1;
      } else {
        break;
      }
    }

    arr[j + 1] = key;
    accesses++;
    if (!sortedIndices.includes(i)) sortedIndices.push(i);

    frames.push({
      array: [...arr],
      auxArray: null,
      highlights: { [j + 1]: "sorted" },
      pointers: [{ index: j + 1, label: `inserted ${key}`, color: "emerald" }],
      comparisons,
      swaps,
      accesses,
      pseudocodeLine: 9,
      explanation: `Inserted key (${key}) into index ${j + 1}. Sorted prefix is now [0...${i}].`,
      sortedIndices: [...sortedIndices],
      activeRange: [0, i]
    });
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
    explanation: `Insertion Sort Complete! Total comparisons: ${comparisons}, Total shifts/writes: ${swaps}.`,
    sortedIndices: [...sortedIndices],
    activeRange: null
  });

  return frames;
}

/**
 * Merge Sort Frame Generator (Divide & Conquer with Auxiliary Array)
 */
