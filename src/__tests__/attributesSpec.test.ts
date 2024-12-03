import { describe, it, expect } from 'vitest';
// import he from 'he';

import { parse } from '../parse';

const encoder = new TextEncoder();

describe('XMLParser', () => {
  it('should parse attributes with valid names', () => {
    const xmlData = encoder.encode(
      `<issue _ent-ity.23="Mjg2MzY2OTkyNA==" state="partial" version="1"></issue>`,
    );
    const expected = {
      issue: {
        '_ent-ity.23': 'Mjg2MzY2OTkyNA==',
        state: 'partial',
        version: 1,
      },
    };

    const result = parse(xmlData, {
      attributeNameProcessor: (name) => name,
      ignoreAttributes: false,
    });

    expect(result).toStrictEqual(expected);

    //result = validator.validate(xmlData);
    //expect(result).toBe(true);
  });

  it('should parse attributes with newline char', () => {
    const xmlData = encoder.encode(
      `<element id="7" data="foo\nbar" bug="true"/>`,
    );
    const expected = {
      element: {
        id: 7,
        data: 'foo bar',
        bug: true,
      },
    };

    const result = parse(xmlData, {
      attributeNameProcessor: (name) => name,
      ignoreAttributes: false,
    });

    expect(result).toStrictEqual(expected);

    //result = validator.validate(xmlData);
    //expect(result).toBe(true);
  });

  it('should not decode HTML entities / char by default', () => {
    const xmlData = encoder.encode(
      `<element id="7" data="foo\nbar" bug="foo&ampbar&apos;"/>`,
    );
    const expected = {
      element: {
        id: 7,
        data: 'foo bar',
        bug: 'foo&ampbar&apos;',
      },
    };

    const result = parse(xmlData, {
      attributeNameProcessor: (name) => name,
      ignoreAttributes: false,
    });

    expect(result).toStrictEqual(expected);
  });

  it('should parse Boolean Attributes', () => {
    const xmlData = encoder.encode(
      `<element id="7" str="" data><selfclosing/><selfclosing /><selfclosingwith attr/></element>`,
    );
    const expected = {
      element: {
        id: 7,
        str: '',
        data: true,
        selfclosing: ['', ''],
        selfclosingwith: {
          attr: true,
        },
      },
    };

    const result = parse(xmlData, {
      attributeNameProcessor: (name) => name,
      ignoreAttributes: false,
      allowBooleanAttributes: true,
    });

    expect(result).toStrictEqual(expected);

    // result = validator.validate(xmlData, {
    //   allowBooleanAttributes: true,
    // });
  });

  it('should not remove xmlns when namespaces are not set to be ignored', () => {
    const xmlData = encoder.encode(
      `<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"></project>`,
    );
    const expected = {
      project: {
        xmlns: 'http://maven.apache.org/POM/4.0.0',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:schemaLocation':
          'http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd',
      },
    };

    const result = parse(xmlData, {
      attributeNameProcessor: (name) => name,
      ignoreAttributes: false,
    });

    expect(result).toStrictEqual(expected);

    // result = validator.validate(xmlData, {
    //   allowBooleanAttributes: true,
    // });
  });

  it('should remove xmlns when namespaces are set to be ignored', () => {
    const xmlData = encoder.encode(
      `<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi-ns="http://www.w3.org/2001/XMLSchema-instance" xsi-ns:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"></project>`,
    );
    const expected = {
      project: {
        //"xmlns": "http://maven.apache.org/POM/4.0.0",
        //"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        schemaLocation:
          'http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd',
      },
    };

    const result = parse(xmlData, {
      attributeNameProcessor: (name) => name,
      ignoreAttributes: false,
      ignoreNameSpace: true,
    });

    expect(result).toStrictEqual(expected);
  });
});
