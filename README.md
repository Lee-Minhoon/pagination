# Pagination

## Description

Pagination algorithm that generates page ranges with ellipsis indicators when necessary.

## Parameters

| Option         | Type                   | Default   | Description                                                                                                                                    |
| -------------- | ---------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `range`        | `number`               | 3         | Number of pages to show around the current page. Ignored if `count` is provided.                                                               |
| `truncate`     | `boolean`              | false     | When using `range`, whether to truncate (collapse) the page range near edges to condense the pagination display.                               |
| `distanceFrom` | `"edge"` \| `"center"` | edge      | When using `range`, defines the positioning of the page range: aligned to the start/end edges `"edge"` or centered on current page `"center"`. |
| `count`        | `number`               | undefined | Maximum number of page indicators to display. When set, `count` takes precedence over `range` and controls visible pagination length.          |
| `bias`         | `"left"` \| `"right"`  | `"right"` | When using `count`, determines whether the current page range is biased toward the left or right side of the pagination.                       |

## Example

```typescript
const pages = generatePages(1, 100, {
  range: 3,
  truncate: false,
  distanceFrom: "edge",
});
// [1, 2, 3, "right", 100]

const pages = generatePages(1, 100, {
  range: 3,
  truncate: true,
  distanceFrom: "edge",
});
// [1, 2, "right", 100]

const pages = generatePages(3, 100, {
  range: 3,
  truncate: false,
  distanceFrom: "edge",
});
// [1, 2, 3, 4, "right", 100]

const pages = generatePages(3, 100, {
  range: 3,
  truncate: false,
  distanceFrom: "center",
});
// [[1, "left", 2, 3, 4, "right", 100]

const pages = generatePages(5, 10, {
  count: 5,
  bias: "right",
});
// [1, "left", 4, 5, 6, 7, "right", 10]

const pages = generatePages(5, 10, {
  count: 5,
  bias: "left",
});
// [1, 2, 3, 4, 5, 6, "right", 10]
```
