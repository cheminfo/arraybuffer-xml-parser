import { ParseOptions } from '../defaultOptions';

export function removeNameSpaceIfNeeded(
  tagName: string,
  options: ParseOptions,
) {
  if (!options.ignoreNameSpace) {
    return tagName;
  }
  const colonIndex = tagName.indexOf(':');
  if (colonIndex !== -1) {
    tagName = tagName.substr(colonIndex + 1);
  }
  return tagName;
}
