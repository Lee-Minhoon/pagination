import { clamp, range } from "lodash-es";
import { distance, quotient } from "./utils";

interface GeneratePagesOption {
  range?: number;
  truncate?: boolean;
  distanceFrom?: "edge" | "center";

  count?: number;
  bias?: "left" | "right";
}

function generatePages(
  pageIndex: number,
  totalPages: number,
  option: GeneratePagesOption = {}
) {
  return option.count
    ? generatePagesByCount(pageIndex, totalPages, option)
    : generatePagesByRange(pageIndex, totalPages, option);
}

function generatePagesByRange(
  pageIndex: number,
  totalPages: number,
  option: Pick<GeneratePagesOption, "range" | "truncate" | "distanceFrom"> = {}
) {
  const { range = 3, truncate = false, distanceFrom = "edge" } = option;

  if (range % 2 === 0) {
    throw new Error("Range must be an odd number");
  }

  const pages: (number | "left" | "right")[] = [];

  const half = quotient(range, 2);

  const start = truncate
    ? Math.max(1, pageIndex - half)
    : clamp(pageIndex - half, 1, totalPages - range + 1);
  const end = truncate
    ? Math.min(pageIndex + half, totalPages)
    : Math.min(start + range - 1, totalPages);

  if (totalPages > 0) {
    pages.push(1);
  }

  const isLeftEllipsisNeeded =
    distanceFrom === "edge"
      ? distance(start, 1) > 1
      : distance(pageIndex, 1) > half;

  if (isLeftEllipsisNeeded) {
    pages.push("left");
  }

  for (let i = start; i <= end; i++) {
    if (i > 1 && i < totalPages) {
      pages.push(i);
    }
  }

  const isRightEllipsisNeeded =
    distanceFrom === "edge"
      ? distance(end, totalPages) > 1
      : distance(pageIndex, totalPages) > half;

  if (isRightEllipsisNeeded) {
    pages.push("right");
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

function generatePagesByCount(
  pageIndex: number,
  totalPages: number,
  option: Pick<GeneratePagesOption, "count" | "bias"> = {}
) {
  const { count = 8, bias = "right" } = option;

  if (count < 5) {
    throw new Error("count must be at least 5");
  }

  if (count >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const isLeftEllipsis =
    bias === "right"
      ? distance(pageIndex, 1) >= Math.floor(count / 2)
      : distance(pageIndex, 1) >= Math.ceil((count + 1) / 2);
  const isRightEllipsis =
    bias === "right"
      ? distance(pageIndex, totalPages) >= Math.ceil((count + 1) / 2)
      : distance(pageIndex, totalPages) >= Math.floor(count / 2);

  const pages: (number | "left" | "right")[] = [1];

  const n = count - 2 - (isLeftEllipsis ? 1 : 0) - (isRightEllipsis ? 1 : 0);

  if (isLeftEllipsis && isRightEllipsis) {
    pages.push("left");
    const left = clamp(
      pageIndex - Math.floor((bias === "right" ? n - 1 : n) / 2),
      2,
      totalPages - n
    );
    const right = Math.min(left + n, totalPages);
    pages.push(...range(left, right));
    pages.push("right");
  } else if (isLeftEllipsis) {
    pages.push("left");
    pages.push(...range(totalPages - n, totalPages));
  } else if (isRightEllipsis) {
    pages.push(...range(2, n + 2));
    pages.push("right");
  }

  pages.push(totalPages);

  return pages;
}

export { generatePages };
