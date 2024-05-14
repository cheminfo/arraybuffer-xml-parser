import { XMLNodeValue } from '../../XMLNode';

export function concat(a?: XMLNodeValue, b?: XMLNodeValue) {
  if (a === undefined) {
    a = typeof b === 'string' ? '' : new Uint8Array(0);
  }
  if (b === undefined) {
    b = typeof a === 'string' ? '' : new Uint8Array(0);
  }
  if (typeof a === 'string' && typeof b === 'string') {
    return a + b;
  } else if (
    typeof a !== 'string' &&
    typeof b !== 'string' &&
    ArrayBuffer.isView(a) &&
    ArrayBuffer.isView(b)
  ) {
    const arrayConcat = new Uint8Array(a.length + b.length);
    arrayConcat.set(a);
    arrayConcat.set(b, a.length);
    return arrayConcat;
  } else {
    throw new Error(
      `Unsuported value type for concatenation: ${typeof a} ${typeof b}`,
    );
  }
}
