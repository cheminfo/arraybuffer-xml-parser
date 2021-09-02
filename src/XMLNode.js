export class XMLNode {
  constructor(tagName, parent, val) {
    this.tagName = tagName;
    this.parent = parent;
    this.child = {}; //child tags
    this.attrsMap = {}; //attributes map
    this.val = val; //text only
  }
  addChild(child) {
    if (Array.isArray(this.child[child.tagName])) {
      //already presents
      this.child[child.tagName].push(child);
    } else {
      this.child[child.tagName] = [child];
    }
  }
}
