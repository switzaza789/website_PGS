export function getVisibleBoard1Indexes(board1, showAllPositions, maxIndex = 31) {
  if (showAllPositions) {
    return Array.from({ length: maxIndex }, (_, index) => index + 1);
  }

  const visible = new Set([1]);
  for (let index = 1; index <= maxIndex; index += 1) {
    if (!board1[index]) continue;
    visible.add(index);
    const left = index * 2;
    const right = left + 1;
    if (left <= maxIndex && Math.floor(Math.log2(left)) <= 3) visible.add(left);
    if (right <= maxIndex && Math.floor(Math.log2(right)) <= 3) visible.add(right);
  }

  return [...visible].sort((left, right) => left - right);
}
