/* eslint-disable no-await-in-loop */

/*
 wait recursively so that all promises are resolved
 need to go through all the nested objects and check if it is a promise
 if it is a promise, then await it
 */

export async function resolveRecursive(object: any) {
  if (typeof object !== 'object') return;
  for (const key in object) {
    if (object[key] instanceof Promise) {
      object[key] = await object[key];
    } else if (typeof object[key] === 'object') {
      await resolveRecursive(object[key]);
    }
  }
}
