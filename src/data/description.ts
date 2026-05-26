export const data = {
    selection_sort: {
        time_complexity: {
            best: "n^2",
            average: "n^2",
            worst: "n^2",
        },
        space_complexity: "1",
        stable: false,
        in_place: true,
        description:
            "Repeatedly finds the minimum element from the unsorted portion and swaps it to the front.",
        read_more: {
            Wikipedia: "https://en.wikipedia.org/wiki/Selection_sort",
        },
    },
    bogo_sort: {
        time_complexity: {
            best: "n",
            average: "n * n!",
            worst: "unbounded",
        },
        space_complexity: "1",
        stable: false,
        in_place: true,
        description:
            "Repeatedly shuffles the array randomly until it happens to be sorted. Purely a joke algorithm with no practical use.",
        read_more: {
            Wikipedia: "https://en.wikipedia.org/wiki/Bogo_sort",
        },
    },
    bubble_sort: {
        time_complexity: {
            best: "n",
            average: "n^2",
            worst: "n^2",
        },
        space_complexity: "1",
        stable: true,
        in_place: true,
        description:
            "Repeatedly steps through the array, compares adjacent elements and swaps them if they are in the wrong order. Best case is O(n) when already sorted with early exit.",
        read_more: {
            Wikipedia: "https://en.wikipedia.org/wiki/Bubble_sort",
        },
    },
    insertion_sort: {
        time_complexity: {
            best: "n",
            average: "n^2",
            worst: "n^2",
        },
        space_complexity: "1",
        stable: true,
        in_place: true,
        description:
            "Builds the sorted array one element at a time by inserting each element into its correct position. Efficient for small or nearly sorted datasets.",
        read_more: {
            Wikipedia: "https://en.wikipedia.org/wiki/Insertion_sort",
        },
    },
    merge_sort: {
        time_complexity: {
            best: "n log n",
            average: "n log n",
            worst: "n log n",
        },
        space_complexity: "n",
        stable: true,
        in_place: false,
        description:
            "Recursively divides the array in half, sorts each half, then merges them back together. Guarantees O(n log n) at the cost of O(n) auxiliary space.",
        read_more: {
            Wikipedia: "https://en.wikipedia.org/wiki/Merge_sort",
        },
    },
    quick_sort: {
        time_complexity: {
            best: "n log n",
            average: "n log n",
            worst: "n^2",
        },
        space_complexity: "log n",
        stable: false,
        in_place: true,
        description:
            "Picks a pivot element and partitions the array around it, then recursively sorts each partition. Worst case O(n^2) occurs when the pivot is always the smallest or largest element.",
        read_more: {
            Wikipedia: "https://en.wikipedia.org/wiki/Quicksort",
        },
    },
} as const;
