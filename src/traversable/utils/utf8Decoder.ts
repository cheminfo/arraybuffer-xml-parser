const utf8Decoder = new TextDecoder();

export const decoder = {
  decode: (array: ArrayBuffer | Uint8Array) => {
    return utf8Decoder.decode(array);
  },
};
