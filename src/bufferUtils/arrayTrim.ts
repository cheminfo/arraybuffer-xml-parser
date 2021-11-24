export function arrayTrim(array:Uint8Array) {
  let i = 0;
  let j = array.length - 1;
  for (; i < array.length && array[i] <= 0x20; i++);
  for (; j >= i && array[j] <= 0x20; j--);
  if (i === 0 && j === array.length - 1) return array;
  return array.subarray(i, j + 1);
}
