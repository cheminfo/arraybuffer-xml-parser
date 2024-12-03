import type { TagValueProcessor } from './traversable/defaultOptions';

export type XMLNodeValue = string | Uint8Array | number | boolean;
export type XMLAttributeValue = string | number | boolean;

export class XMLNode {
  public tagName: string;
  public parent?: XMLNode;
  public children: Record<string, XMLNode[]>;
  public attributes?: Record<string, XMLAttributeValue>;
  public bytes: Uint8Array;
  public startIndex: number;
  private tagValueProcessor: TagValueProcessor;
  private cachedValue?: XMLNodeValue;
  public constructor(
    tagName: string,
    parent: XMLNode | undefined,
    bytes: Uint8Array,
    tagValueProcessor: TagValueProcessor,
  ) {
    this.tagName = tagName;
    this.parent = parent;
    this.children = Object.create(null); //child tags
    this.attributes = Object.create(null); //attributes map
    this.bytes = bytes; //text only
    this.tagValueProcessor = tagValueProcessor;
    this.startIndex = -1;
  }
  public append(toAppend: Uint8Array): void {
    if (this.bytes.length === 0) {
      this.bytes = toAppend;
      return;
    }
    const arrayConcat = new Uint8Array(this.bytes.length + toAppend.length);
    arrayConcat.set(this.bytes);
    arrayConcat.set(toAppend, this.bytes.length);
    this.bytes = arrayConcat;
  }
  public get value(): any {
    if (this.cachedValue === undefined) {
      const value = this.tagValueProcessor(this.bytes, this);
      this.cachedValue = value;
    }
    return this.cachedValue;
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
