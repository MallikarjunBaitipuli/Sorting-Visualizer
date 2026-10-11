function generateMergeSortFrames(initialArray) {
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
    pointers: [{ index: 0, label: "L=0", color: "blue" }, { index: n - 1, label: `R=${n - 1}`, color: "blue" }],
    comparisons,
    swaps,
    accesses,
    pseudocodeLine: 1,
    explanation: `Starting Merge Sort (Divide & Conquer). Initial range: [0...${n - 1}].`,
    sortedIndices: [...sortedIndices],
    activeRange: [0, n - 1]
  });

  function mergeSortHelper(left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    frames.push({
      array: [...arr],
      auxArray: null,
      highlights: {},
      pointers: [
        { index: left, label: "left", color: "blue" },
        { index: mid, label: "mid", color: "purple" },
        { index: right, label: "right", color: "blue" }
      ],
      comparisons,
      swaps,
      accesses,
      pseudocodeLine: 3,
      explanation: `Dividing subarray [${left}...${right}] at mid = ${mid}. Left half: [${left}...${mid}], Right half: [${mid + 1}...${right}].`,
      sortedIndices: [...sortedIndices],
      activeRange: [left, right]
    });

    mergeSortHelper(left, mid);
    mergeSortHelper(mid + 1, right);
    merge(left, mid, right);
  }

  function merge(left, mid, right) {
    const leftLen = mid - left + 1;
    const rightLen = right - mid;
    const L = [];
    const R = [];

    for (let i = 0; i < leftLen; i++) {
      L.push(arr[left + i]);
      accesses++;
    }
    for (let j = 0; j < rightLen; j++) {
      R.push(arr[mid + 1 + j]);
      accesses++;
    }

    const auxBuffer = [...L, ...R];

    frames.push({
      array: [...arr],
      auxArray: [...auxBuffer],
      highlights: {},
      pointers: [
        { index: left, label: "L", color: "blue" },
        { index: mid, label: "mid", color: "purple" },
        { index: right, label: "R", color: "blue" }
      ],
      auxPointers: [
        { index: 0, label: "Aux Left", color: "cyan" },
        { index: leftLen, label: "Aux Right", color: "amber" }
      ],
      comparisons,
      swaps,
      accesses,
      pseudocodeLine: 9,
      explanation: `Copying subarrays to auxiliary buffer: Left = [${L.join(", ")}], Right = [${R.join(", ")}].`,
      sortedIndices: [...sortedIndices],
      activeRange: [left, right]
    });

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftLen && j < rightLen) {
      comparisons++;
      accesses += 2;
      const isLeftSmaller = L[i] <= R[j];

      frames.push({
        array: [...arr],
        auxArray: [...auxBuffer],
        highlights: { [k]: "comparing" },
        pointers: [{ index: k, label: `k=${k}`, color: "purple" }],
        auxPointers: [
          { index: i, label: `L[${i}]`, color: "cyan" },
          { index: leftLen + j, label: `R[${j}]`, color: "amber" }
        ],
        comparisons,
        swaps,
        accesses,
        pseudocodeLine: 10,
        explanation: `Comparing Aux Left L[${i}] (${L[i]}) and Aux Right R[${j}] (${R[j]}). ${isLeftSmaller ? `L[${i}] (${L[i]}) is smaller/equal → Place in arr[${k}].` : `R[${j}] (${R[j]}) is smaller → Place in arr[${k}].`}`,
        sortedIndices: [...sortedIndices],
        activeRange: [left, right]
      });

      if (isLeftSmaller) {
        arr[k] = L[i];
        accesses++;
        swaps++;
        i++;
      } else {
        arr[k] = R[j];
        accesses++;
        swaps++;
        j++;
      }

      frames.push({
        array: [...arr],
        auxArray: [...auxBuffer],
        highlights: { [k]: "swapping" },
        pointers: [{ index: k, label: `merged ${arr[k]}`, color: "emerald" }],
        auxPointers: [],
        comparisons,
        swaps,
        accesses,
        pseudocodeLine: 10,
        explanation: `Merged value ${arr[k]} into position arr[${k}].`,
        sortedIndices: [...sortedIndices],
        activeRange: [left, right]
      });

      k++;
    }

    while (i < leftLen) {
      arr[k] = L[i];
      accesses += 2;
      swaps++;

      frames.push({
        array: [...arr],
        auxArray: [...auxBuffer],
        highlights: { [k]: "swapping" },
        pointers: [{ index: k, label: `copy L[${i}]`, color: "cyan" }],
        auxPointers: [{ index: i, label: `L[${i}]`, color: "cyan" }],
        comparisons,
        swaps,
        accesses,
        pseudocodeLine: 10,
        explanation: `Copying remaining element from Left Aux L[${i}] (${L[i]}) into arr[${k}].`,
        sortedIndices: [...sortedIndices],
        activeRange: [left, right]
      });

      i++;
      k++;
    }

    while (j < rightLen) {
      arr[k] = R[j];
      accesses += 2;
      swaps++;

      frames.push({
        array: [...arr],
        auxArray: [...auxBuffer],
        highlights: { [k]: "swapping" },
        pointers: [{ index: k, label: `copy R[${j}]`, color: "amber" }],
        auxPointers: [{ index: leftLen + j, label: `R[${j}]`, color: "amber" }],
        comparisons,
        swaps,
        accesses,
        pseudocodeLine: 10,
        explanation: `Copying remaining element from Right Aux R[${j}] (${R[j]}) into arr[${k}].`,
        sortedIndices: [...sortedIndices],
        activeRange: [left, right]
      });

      j++;
      k++;
    }

    if (left === 0 && right === n - 1) {
      for (let idx = 0; idx < n; idx++) sortedIndices.push(idx);
    }
  }

  mergeSortHelper(0, n - 1);

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
    pseudocodeLine: 6,
    explanation: `Merge Sort Complete! Time: O(n log n), Auxiliary Space: O(n). Total comparisons: ${comparisons}.`,
    sortedIndices: [...sortedIndices],
    activeRange: null
  });

  return frames;
}

/**
 * Quick Sort Frame Generator (Lomuto Partition Scheme)
 */
