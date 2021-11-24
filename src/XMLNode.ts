export class XMLNode {
  tagName: string;
  parent?: XMLNode;
  children: Record<string,XMLNode[]>;
  attributes?: Record<string,XMLNode|boolean>;
  value?: string |Uint8Array;
  startIndex: number;
  constructor(tagName: string, parent?: XMLNode, value?: string|Uint8Array) {
    this.tagName = tagName;
    this.parent = parent;
    this.children = Object.create({}); //child tags
    this.attributes = Object.create({}); //attributes map
    this.value = value; //text only
    this.startIndex = -1;
  }
  addChild(child: XMLNode) {
    if (Array.isArray(this.children[child.tagName])) {
      //already presents
      this.children[child.tagName].push(child);
    } else {
      this.children[child.tagName] = [child];
    }
  }
}
