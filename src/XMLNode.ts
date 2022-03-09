export class XMLNode {
  public tagName: string;
  public parent?: XMLNode;
  public children: Record<string, XMLNode[]>;
  public attributes?: Record<string, XMLNode | boolean>;
  public value?: string | Uint8Array;
  public startIndex: number;
  public constructor(
    tagName: string,
    parent?: XMLNode,
    value?: Uint8Array | string,
  ) {
    this.tagName = tagName;
    this.parent = parent;
    this.children = Object.create({}); //child tags
    this.attributes = Object.create({}); //attributes map
    this.value = value; //text only
    this.startIndex = -1;
  }
  public addChild(child: XMLNode) {
    if (Array.isArray(this.children[child.tagName])) {
      //already presents
      this.children[child.tagName].push(child);
    } else {
      this.children[child.tagName] = [child];
    }
  }
}
