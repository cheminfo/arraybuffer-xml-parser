import type { TagValueProcessor } from './traversable/defaultOptions.ts';

export type XMLNodeValue = string | Uint8Array | number | boolean;
export type XMLAttributeValue = string | number | boolean;

// Shared placeholder so every node still exposes an object-typed `children`
// without allocating one. addChild swaps in a real map on first use.
const NO_CHILDREN: Record<string, XMLNode[]> = Object.create(null);

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
    this.children = NO_CHILDREN; //child tags
    this.attributes = undefined; //attributes map
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
    if (this.children === NO_CHILDREN) {
      this.children = Object.create(null);
    }
    const existing = this.children[child.tagName];
    if (Array.isArray(existing)) {
      existing.push(child);
    } else {
      this.children[child.tagName] = [child];
    }
  }
}
