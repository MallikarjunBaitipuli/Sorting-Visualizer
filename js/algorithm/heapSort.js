function generateHeapSortFrames(initialArray) {
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
    explanation: `Starting Heap Sort. Phase 1: Build Max-Heap in O(n) time.`,
    sortedIndices: [...sortedIndices],
    activeRange: [0, n - 1]
  });

  function maxHeapify(heapSize, root) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < heapSize) {
      comparisons++;
      accesses += 2;
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < heapSize) {
      comparisons++;
      accesses += 2;
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== root) {
      swaps++;
      accesses += 4;
      const temp = arr[root];
      arr[root] = arr[largest];
      arr[largest] = temp;

      frames.push({
        array: [...arr],
        auxArray: null,
        highlights: {
          [root]: "swapping",
          [largest]: "swapping"
        },
        pointers: [
          { index: root, label: "parent", color: "rose" },
          { index: largest, label: "child", color: "rose" }
        ],
        comparisons,
        swaps,
        accesses,
        pseudocodeLine: 11,
        explanation: `MaxHeapify: Swapped parent arr[${root}] with larger child arr[${largest}] (${arr[root]}).`,
        sortedIndices: [...sortedIndices],
        activeRange: [0, heapSize - 1]
      });

      maxHeapify(heapSize, largest);
    }
  }

  // Phase 1: Build Max Heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    frames.push({
      array: [...arr],
      auxArray: null,
      highlights: { [i]: "selected" },
      pointers: [{ index: i, label: `heapify node ${i}`, color: "purple" }],
      comparisons,
      swaps,
      accesses,
      pseudocodeLine: 2,
      explanation: `Phase 1 (Build-Max-Heap): Heapifying subtree rooted at index ${i} (Value: ${arr[i]}).`,
      sortedIndices: [...sortedIndices],
      activeRange: [0, n - 1]
    });
    maxHeapify(n, i);
  }

  frames.push({
    array: [...arr],
    auxArray: null,
    highlights: { 0: "pivot" },
    pointers: [{ index: 0, label: `Max Root = ${arr[0]}`, color: "emerald" }],
    comparisons,
    swaps,
    accesses,
    pseudocodeLine: 2,
    explanation: `Max-Heap constructed! The maximum element (${arr[0]}) is at root arr[0]. Phase 2: Repeatedly extract max.`,
    sortedIndices: [...sortedIndices],
    activeRange: [0, n - 1]
  });

  // Phase 2: Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    // Swap root with end of unsorted heap
    swaps++;
    accesses += 4;
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;

    sortedIndices.push(i);

    frames.push({
      array: [...arr],
      auxArray: null,
      highlights: {
        [0]: "swapping",
        [i]: "sorted"
      },
      pointers: [
        { index: 0, label: "new root", color: "amber" },
        { index: i, label: `max extracted (${arr[i]})`, color: "emerald" }
      ],
      comparisons,
      swaps,
      accesses,
      pseudocodeLine: 4,
      explanation: `Extracted max element (${arr[i]}) to index ${i}. Reduced heap size to ${i}. Restoring Max-Heap property.`,
      sortedIndices: [...sortedIndices],
      activeRange: [0, i - 1]
    });

    maxHeapify(i, 0);
  }

  sortedIndices.push(0);
  frames.push({
    array: [...arr],
    auxArray: null,
    highlights: {},
    pointers: [],
    comparisons,
    swaps,
    accesses,
    pseudocodeLine: 5,
    explanation: `Heap Sort Complete! Worst Case Time: O(n log n), Auxiliary Space: O(1). Total comparisons: ${comparisons}.`,
    sortedIndices: [...sortedIndices],
    activeRange: null
  });

  return frames;
}

/**
 * Visualizer Rendering Engine
 * Renders Number Cards, Index Labels, Active Pointer Badges, and Auxiliary Arrays
 */
