export class XMLNode {
  constructor(tagName, parent, value) {
    this.tagName = tagName;
    this.parent = parent;
    this.children = Object.create({}); //child tags
    this.attributes = Object.create({}); //attributes map
    this.val = value; //text only
    this.startIndex = -1;
  }
  addChild(child) {
    if (Array.isArray(this.children[child.tagName])) {
      //already presents
      this.children[child.tagName].push(child);
    } else {
      this.children[child.tagName] = [child];
    }
  }
}
