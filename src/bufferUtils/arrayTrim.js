export function arrayTrim(array) {
  let i = 0;
  let j = array.length - 1;
  for (; i < array.length && array[i] <= 0x20; i++);
  for (; j >= i && array[j] <= 0x20; j--);
  return array.subarray(i, j + 1);
}
