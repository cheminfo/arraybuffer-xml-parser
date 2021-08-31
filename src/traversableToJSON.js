import { isTagNameInArrayMode, merge, isEmptyObject } from './util';

export function traversableToJSON(traversable, options, parentTagName) {
  const jObj = {};

  // when no child node or attr is present
  if (
    (!traversable.child || isEmptyObject(traversable.child)) &&
    (!traversable.attrsMap || isEmptyObject(traversable.attrsMap))
  ) {
    return traversable.val === undefined ? '' : traversable.val;
  }

  // otherwise create a textnode if node has some text
  if (
    traversable.val !== undefined &&
    !(
      typeof traversable.val === 'string' &&
      (traversable.val === '' || traversable.val === options.cdataPositionChar)
    )
  ) {
    const asArray = isTagNameInArrayMode(
      traversable.tagname,
      options.arrayMode,
      parentTagName,
    );
    jObj[options.textNodeName] = asArray ? [traversable.val] : traversable.val;
  }

  merge(jObj, traversable.attrsMap, options.arrayMode);

  const keys = Object.keys(traversable.child);
  for (let index = 0; index < keys.length; index++) {
    const tagName = keys[index];
    if (traversable.child[tagName] && traversable.child[tagName].length > 1) {
      jObj[tagName] = [];
      for (let tag in traversable.child[tagName]) {
        if (
          Object.prototype.hasOwnProperty.call(traversable.child[tagName], tag)
        ) {
          jObj[tagName].push(
            traversableToJSON(
              traversable.child[tagName][tag],
              options,
              tagName,
            ),
          );
        }
      }
    } else {
      const result = traversableToJSON(
        traversable.child[tagName][0],
        options,
        tagName,
      );
      const asArray =
        (options.arrayMode === true && typeof result === 'object') ||
        isTagNameInArrayMode(tagName, options.arrayMode, parentTagName);
      jObj[tagName] = asArray ? [result] : result;
    }
  }

  return jObj;
}
