

const validator = require("../validator");

describe("XMLParser", function() {
    it("should validate big XML file", function() {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "assets/large.xml");
        const svgData = fs.readFileSync(fileNamePath).toString();

        const result = validator.validate(svgData);
        expect(result).toBe(true);
    });
});
