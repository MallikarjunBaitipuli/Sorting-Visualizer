const PSEUDOCODE_DATA = {
  bubble: [
    { line: 1, text: "procedure BubbleSort(A : list of sortable items)" },
    { line: 2, text: "  n := length(A)" },
    { line: 3, text: "  for i := 0 to n - 1 do" },
    { line: 4, text: "    swapped := false" },
    { line: 5, text: "    for j := 0 to n - i - 2 do" },
    { line: 6, text: "      if A[j] > A[j + 1] then" },
    { line: 7, text: "        swap(A[j], A[j + 1])" },
    { line: 8, text: "        swapped := true" },
    { line: 9, text: "    if not swapped then break  // early exit optimization" },
    { line: 10, text: "  return A" }
  ],
  selection: [
    { line: 1, text: "procedure SelectionSort(A : list of sortable items)" },
    { line: 2, text: "  n := length(A)" },
    { line: 3, text: "  for i := 0 to n - 2 do" },
    { line: 4, text: "    min_idx := i" },
    { line: 5, text: "    for j := i + 1 to n - 1 do" },
    { line: 6, text: "      if A[j] < A[min_idx] then" },
    { line: 7, text: "        min_idx := j  // update current minimum" },
    { line: 8, text: "    if min_idx != i then" },
    { line: 9, text: "      swap(A[i], A[min_idx])" },
    { line: 10, text: "  return A" }
  ],
  insertion: [
    { line: 1, text: "procedure InsertionSort(A : list of sortable items)" },
    { line: 2, text: "  n := length(A)" },
    { line: 3, text: "  for i := 1 to n - 1 do" },
    { line: 4, text: "    key := A[i]" },
    { line: 5, text: "    j := i - 1" },
    { line: 6, text: "    while j >= 0 and A[j] > key do" },
    { line: 7, text: "      A[j + 1] := A[j]  // shift element right" },
    { line: 8, text: "      j := j - 1" },
    { line: 9, text: "    A[j + 1] := key    // insert key into sorted prefix" },
    { line: 10, text: "  return A" }
  ],
  merge: [
    { line: 1, text: "procedure MergeSort(A, left, right)" },
    { line: 2, text: "  if left < right then" },
    { line: 3, text: "    mid := floor((left + right) / 2)" },
    { line: 4, text: "    MergeSort(A, left, mid)        // sort left half" },
    { line: 5, text: "    MergeSort(A, mid + 1, right)   // sort right half" },
    { line: 6, text: "    Merge(A, left, mid, right)     // combine sorted halves" },
    { line: 7, text: " " },
    { line: 8, text: "procedure Merge(A, left, mid, right)" },
    { line: 9, text: "  Copy subarrays to AuxL and AuxR" },
    { line: 10, text: "  Merge AuxL and AuxR back into A[left...right]" }
  ],
  quick: [
    { line: 1, text: "procedure QuickSort(A, low, high)" },
    { line: 2, text: "  if low < high then" },
    { line: 3, text: "    p := Partition(A, low, high)   // Lomuto partition" },
    { line: 4, text: "    QuickSort(A, low, p - 1)       // sort left subarray" },
    { line: 5, text: "    QuickSort(A, p + 1, high)      // sort right subarray" },
    { line: 6, text: " " },
    { line: 7, text: "procedure Partition(A, low, high)" },
    { line: 8, text: "  pivot := A[high];  i := low - 1" },
    { line: 9, text: "  for j := low to high - 1 do" },
    { line: 10, text: "    if A[j] <= pivot then i := i + 1; swap(A[i], A[j])" },
    { line: 11, text: "  swap(A[i + 1], A[high]); return i + 1" }
  ],
  heap: [
    { line: 1, text: "procedure HeapSort(A)" },
    { line: 2, text: "  BuildMaxHeap(A)                  // O(n) construction" },
    { line: 3, text: "  for i := length(A) - 1 downto 1 do" },
    { line: 4, text: "    swap(A[0], A[i])               // extract max to sorted suffix" },
    { line: 5, text: "    MaxHeapify(A, 0, i)            // restore heap of size i" },
    { line: 6, text: " " },
    { line: 7, text: "procedure MaxHeapify(A, root, heapSize)" },
    { line: 8, text: "  largest := root; l := 2*root + 1; r := 2*root + 2" },
    { line: 9, text: "  if l < heapSize and A[l] > A[largest] then largest := l" },
    { line: 10, text: "  if r < heapSize and A[r] > A[largest] then largest := r" },
    { line: 11, text: "  if largest != root then swap(A[root], A[largest]); MaxHeapify(A, largest, heapSize)" }
  ]
};

/**
 * Bubble Sort Frame Generator
 */
