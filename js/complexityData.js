const COMPLEXITY_DATA = {
  bubble: {
    name: "Bubble Sort",
    category: "Incremental / Comparison-Based",
    timeBest: "O(n)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    spaceWorst: "O(1)",
    inPlace: "Yes",
    stable: "Yes",
    recurrence: "T(n) = T(n - 1) + O(n)",
    description: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. With an early termination flag, it achieves O(n) best-case time for already sorted arrays.",
    realLifeExample: {
      analogy: "🫧 Carbonated Bubbles / School Height Line",
      story: "Imagine a line of students standing in random order. The teacher walks from left to right, comparing adjacent students and swapping them if the left student is taller. By the time the teacher reaches the end, the tallest student has 'bubbled up' to the very back of the line.",
      icon: "🫧"
    },
    practicalUses: [
      "Detecting nearly-sorted datasets with a single misplaced element (O(n) pass).",
      "Educational graphics and teaching fundamental algorithm mechanics.",
      "Ultra-low-memory microcontrollers (IoT sensors) with extremely small arrays (N ≤ 10)."
    ],
    advantages: [
      "Simple to implement and understand.",
      "Operates strictly in-place (O(1) auxiliary space).",
      "Stable sort: preserves relative order of duplicate elements.",
      "Adaptive: runs in O(n) linear time when array is already sorted."
    ],
    drawbacks: [
      "Inefficient O(n²) average and worst-case time complexity.",
      "Excessive number of swap operations compared to other algorithms.",
      "Impractical for real-world production datasets."
    ],
    daAnalysis: [
      "Total Comparisons in Worst/Avg Case: n(n-1)/2 = O(n²)",
      "Total Swaps in Worst Case (Reverse Sorted): n(n-1)/2 = O(n²)",
      "Best Case Comparisons with flag: n - 1 = O(n)",
      "Adaptive: Yes (when optimized with swapped flag)"
    ]
  },

  selection: {
    name: "Selection Sort",
    category: "Selection / Comparison-Based",
    timeBest: "O(n²)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    spaceWorst: "O(1)",
    inPlace: "Yes",
    stable: "No (Standard version)",
    recurrence: "T(n) = T(n - 1) + O(n)",
    description: "Divides the array into sorted and unsorted subarrays. Repeatedly finds the minimum element from the unsorted subarray and swaps it with the first unsorted element.",
    realLifeExample: {
      analogy: "✏️ Arranging Pencils / Handpicking Cards",
      story: "Imagine a messy desk with pencils of different lengths. You scan the entire desk to find the single shortest pencil and place it at position 1. Then you scan the remaining pencils to find the next shortest and place it at position 2, repeating until all pencils are aligned.",
      icon: "✏️"
    },
    practicalUses: [
      "Flash Memory & EEPROM Write-Constrained Systems: Memory cells have limited write lifecycles. Selection Sort makes at most n - 1 swaps total, minimizing costly hardware writes.",
      "Embedded hardware devices where memory writes are drastically more expensive than read cycles."
    ],
    advantages: [
      "Minimal memory writes: makes at most n - 1 swaps across its entire execution.",
      "In-place sorting requiring strictly O(1) auxiliary space.",
      "Predictable runtime performance with zero dynamic memory allocation."
    ],
    drawbacks: [
      "Always performs O(n²) comparisons even if the input array is already sorted.",
      "Not adaptive: best, average, and worst-case are all O(n²).",
      "Unstable: standard swap can alter the relative order of identical elements."
    ],
    daAnalysis: [
      "Always makes exactly n(n-1)/2 comparisons regardless of initial array ordering.",
      "Makes at most O(n) swaps (at most n-1 swaps), optimal when write operations are expensive.",
      "Not adaptive: Best, Average, and Worst case time complexities are all O(n²)."
    ]
  },

  insertion: {
    name: "Insertion Sort",
    category: "Incremental / Adaptive",
    timeBest: "O(n)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    spaceWorst: "O(1)",
    inPlace: "Yes",
    stable: "Yes",
    recurrence: "T(n) = T(n - 1) + O(n) (Worst Case)",
    description: "Builds the sorted array one item at a time. It picks the next element (key) and shifts all larger elements in the sorted prefix to the right to insert the key in its correct position.",
    realLifeExample: {
      analogy: "🃏 Sorting a Hand of Playing Cards",
      story: "When dealt playing cards one by one, you hold the sorted cards in your left hand. As you receive a new card in your right hand, you scan from right to left, shift the larger cards over, and insert the new card into its correct position.",
      icon: "🃏"
    },
    practicalUses: [
      "Hybrid Production Sorters: Used as the base-case sorting routine in Python's Timsort and C++'s std::sort (Introsort) for small partitions (N ≤ 16–32) where it beats QuickSort due to zero overhead.",
      "Online Real-Time Streaming: Sorting data as it continuously arrives from a network stream.",
      "Nearly-sorted database records."
    ],
    advantages: [
      "Extremely fast and lightweight for small arrays (N ≤ 16).",
      "Adaptive: runs in O(n) linear time on already-sorted or nearly-sorted datasets.",
      "In-place (O(1) extra space) and strictly stable.",
      "Online: can sort a list as it receives continuous streaming items."
    ],
    drawbacks: [
      "O(n²) time on reverse-sorted or randomly ordered large arrays.",
      "Requires shifting elements one by one, causing numerous memory writes on large inputs."
    ],
    daAnalysis: [
      "Number of inversions directly determines runtime: Time = O(n + I) where I is inversion count.",
      "Best Case: O(n) comparisons and 0 shifts when array is already sorted.",
      "Worst Case (Reverse Sorted): n(n-1)/2 comparisons and shifts = O(n²).",
      "Very efficient for small datasets (n ≤ 10 to 20)."
    ]
  },

  merge: {
    name: "Merge Sort",
    category: "Divide and Conquer",
    timeBest: "O(n log n)",
    timeAvg: "O(n log n)",
    timeWorst: "O(n log n)",
    spaceWorst: "O(n) auxiliary",
    inPlace: "No",
    stable: "Yes",
    recurrence: "T(n) = 2T(n/2) + O(n)",
    description: "Divides the unsorted list into two approximately equal halves, recursively sorts both halves, and then merges the two sorted halves into a single sorted array using an auxiliary buffer.",
    realLifeExample: {
      analogy: "📑 Merging Two Stacks of Graded Exam Papers",
      story: "Imagine two teaching assistants have each sorted their own half of 500 exam papers alphabetically. To combine them, the professor looks at the top paper of each stack, picks whichever paper comes first in the alphabet, and places it in the final box.",
      icon: "📑"
    },
    practicalUses: [
      "External Sorting (Big Data): Sorting multi-gigabyte files and database tables that cannot fit into RAM (e.g. SQLite, PostgreSQL external sort, Hadoop map-reduce).",
      "Sorting Singly Linked Lists: Can be done in O(n log n) with O(1) auxiliary pointer updates without random array indexing.",
      "E-Commerce Catalog Sorting (Amazon / Flipkart product filters)."
    ],
    advantages: [
      "Guaranteed O(n log n) worst-case time complexity (no catastrophic O(n²) degradation).",
      "Strictly Stable: maintains the original relative order of duplicate elements.",
      "Highly parallelizable: independent subproblems can run on multi-core CPUs.",
      "Optimal for sequential streaming data and disk-based storage."
    ],
    drawbacks: [
      "Requires O(n) auxiliary memory buffer to merge subarrays.",
      "Slightly slower than QuickSort in RAM due to memory allocation and copying overhead."
    ],
    daAnalysis: [
      "Master Theorem: a = 2, b = 2, f(n) = O(n) ⇒ Case 2 applies: log_b(a) = log_2(2) = 1, so T(n) = Θ(n log n).",
      "Consistent O(n log n) runtime across best, worst, and average cases.",
      "Requires O(n) extra space for merging sub-arrays.",
      "Highly suitable for external sorting on linked lists and large files."
    ]
  },

  quick: {
    name: "Quick Sort",
    category: "Divide and Conquer / Partitioning",
    timeBest: "O(n log n)",
    timeAvg: "O(n log n)",
    timeWorst: "O(n²)",
    spaceWorst: "O(log n) call stack (Worst: O(n))",
    inPlace: "Yes",
    stable: "No",
    recurrence: "Best/Avg: T(n) = 2T(n/2) + O(n) | Worst: T(n) = T(n - 1) + O(n)",
    description: "Selects a 'pivot' element, partitions the array such that all elements smaller than pivot are on the left and larger on the right, then recursively applies the same logic to both partitions.",
    realLifeExample: {
      analogy: "🗂 Filing Office Documents by Letter (e.g. 'M')",
      story: "You have a towering pile of unorganized employee files. You pick 'M' as a separator (pivot) and split the pile into two boxes: 'A to M' on your left, and 'N to Z' on your right. Then you repeat the same process inside each smaller box until every file is in order.",
      icon: "🗂"
    },
    practicalUses: [
      "Default General-Purpose Sorting in Language Runtimes: C standard library (qsort), C++ STL (std::sort - Introsort), V8 JavaScript engine (Array.prototype.sort).",
      "Operating system memory allocators and high-throughput systems."
    ],
    advantages: [
      "Fastest general-purpose sorting algorithm in practice for in-memory data.",
      "Operates in-place: requires only O(log n) auxiliary stack space.",
      "Excellent CPU cache locality: scans elements sequentially from left and right.",
      "Low constant factors compared to HeapSort and MergeSort."
    ],
    drawbacks: [
      "Unstable: swaps can change the relative order of equal keys.",
      "Degrades to O(n²) worst-case time if poorly chosen pivot yields unbalanced partitions (e.g. sorted array with naive last-element pivot).",
      "Worst-case recursion stack space can reach O(n)."
    ],
    daAnalysis: [
      "Average Case: Partition divides array in balanced ratios ⇒ O(n log n).",
      "Worst Case: When array is already sorted or reverse sorted (with last element as pivot), partition splits into sizes 0 and n-1 ⇒ T(n) = T(n-1) + O(n) = O(n²).",
      "In-place sorting with very small cache footprint and low constant factors."
    ]
  },

  heap: {
    name: "Heap Sort",
    category: "Tree-Based / Priority Queue",
    timeBest: "O(n log n)",
    timeAvg: "O(n log n)",
    timeWorst: "O(n log n)",
    spaceWorst: "O(1)",
    inPlace: "Yes",
    stable: "No",
    recurrence: "T(n) = Build-Max-Heap(n) + Σ O(log i) = O(n) + O(n log n) = O(n log n)",
    description: "Builds a Max-Heap from the input array in O(n) time. Repeatedly swaps the root (maximum element) with the last unsorted element, decreases heap size, and restores the Max-Heap property via heapify.",
    realLifeExample: {
      analogy: "🏥 Hospital Emergency Room Triage Queue",
      story: "In an emergency room, arriving patients are organized by medical severity in a priority heap. The critical patient with the highest urgency is always at the top of the queue (root). As soon as the top patient is treated, the heap rebalances so the next most critical patient moves to the top.",
      icon: "🏥"
    },
    practicalUses: [
      "Linux Kernel CPU Scheduling: Completely Fair Scheduler (CFS) and priority task queues.",
      "Embedded & Safety-Critical Real-Time Systems (avionics, automotive): Guarantees strictly O(n log n) time with zero risk of stack overflow (O(1) space).",
      "Top-K element extraction and streaming order statistics."
    ],
    advantages: [
      "Guaranteed O(n log n) worst-case time with strictly O(1) auxiliary memory.",
      "No recursion stack overflow risk (non-recursive in-place heapify).",
      "Optimal when you only need to extract the top-K maximum/minimum elements."
    ],
    drawbacks: [
      "Unstable sorting algorithm.",
      "Slower constant factor than QuickSort: jumping between parent and children indices (2i+1, 2i+2) causes frequent CPU L1/L2 cache misses."
    ],
    daAnalysis: [
      "Building Max-Heap takes O(n) time (using Taylor series / aggregate analysis).",
      "Extracting max takes O(log n) time per element for n elements ⇒ n * O(log n).",
      "Guarantees O(n log n) worst-case time with strictly O(1) auxiliary space.",
      "Not cache-friendly compared to QuickSort due to non-contiguous heap index jumps (2i+1, 2i+2)."
    ]
  }
};

/**
 * Pseudocode definitions with line numbers for sorting algorithms
 */
