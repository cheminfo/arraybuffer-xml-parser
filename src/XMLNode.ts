export class XMLNode {
  public attributes: any;
  public children: any;
  public parent: XMLNode;
  public startIndex: number;
  public tagName: string;
  public value: string;

  public constructor(tagName: string, parent: XMLNode, value: string) {
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
