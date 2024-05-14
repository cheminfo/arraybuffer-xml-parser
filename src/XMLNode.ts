export type XMLNodeValue = string | Uint8Array | number | boolean;

export class XMLNode {
  public tagName: string;
  public parent?: XMLNode;
  public children: Record<string, XMLNode[]>;
  public attributes?: Record<string, XMLNode | boolean>;
  public value?: XMLNodeValue;
  public startIndex: number;
  public constructor(
    tagName: string,
    parent?: XMLNode,
    value?: Uint8Array | string | undefined | number,
  ) {
    this.tagName = tagName;
    this.parent = parent;
    this.children = Object.create(null); //child tags
    this.attributes = Object.create(null); //attributes map
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
