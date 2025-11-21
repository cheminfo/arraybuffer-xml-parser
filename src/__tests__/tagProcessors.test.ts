import { describe, expect, it } from 'vitest';

import { parse } from '../parse.js';

describe('XMLParser', () => {
  it('tag name processor', () => {
    const xmlData = `<?xml version='1.0'?>
        <any_name>
            <person>
                end
            </person>
        </any_name>`;

    const result = parse(xmlData, {
      tagNameProcessor: (name) => name.toUpperCase(),
    });

    expect(result).toStrictEqual({ ANY_NAME: { PERSON: 'end' } });

    const tagNames: Array<{ name: string; nodes: string[] }> = [];
    parse(xmlData, {
      tagNameProcessor: (name, nodes) => {
        tagNames.push({ name, nodes: nodes.map((c) => c.tagName) });
        return name.toUpperCase();
      },
    });

    expect(tagNames).toStrictEqual([
      { name: 'any_name', nodes: ['any_name'] },
      { name: 'person', nodes: ['person'] },
    ]);
  });

  it('attribute name processor', () => {
    const xmlData = `<?xml version='1.0'?>
	    <ab param1="abc" param2="def">
	    </ab>`;

    const result = parse(xmlData, {
      attributeNameProcessor: (name: string) => `$${name.toUpperCase()}`,
    });

    expect(result).toStrictEqual({ ab: { $PARAM1: 'abc', $PARAM2: 'def' } });
  });
});
