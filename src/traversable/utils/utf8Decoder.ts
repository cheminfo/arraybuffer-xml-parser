const utf8Decoder = new TextDecoder();

export const decoder = {
  decode: (array: BufferSource | Uint8Array) => {
    return utf8Decoder.decode(array);
  },
};
