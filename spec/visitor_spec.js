const fs = require("fs");
const path = require("path");
const { Visitor, load, errorMessages } = require("../src/visitor.js");

describe("Visitor", () => {
  let originalWriteFileSync, originalReadFileSync, originalExistsSync, originalMkdirSync;

  beforeEach(() => {
    originalWriteFileSync = fs.writeFileSync;
    originalReadFileSync = fs.readFileSync;
    originalExistsSync = fs.existsSync;
    originalMkdirSync = fs.mkdirSync;

    fs.writeFileSync = jasmine.createSpy("writeFileSync");
    fs.readFileSync = jasmine.createSpy("readFileSync");
    fs.existsSync = jasmine.createSpy("existsSync").and.returnValue(true);
    fs.mkdirSync = jasmine.createSpy("mkdirSync");
  });

  afterEach(() => {
    fs.writeFileSync = originalWriteFileSync;
    fs.readFileSync = originalReadFileSync;
    fs.existsSync = originalExistsSync;
    fs.mkdirSync = originalMkdirSync;
  });

  describe("constructor", () => {
    it("should create a Visitor instance with valid inputs", () => {
      const visitor = new Visitor(
        "Sakhe Hlela",
        25,
        "2024-06-19",
        "14:30",
        "Interested in the program",
        "Rose"
      );
      expect({ ...visitor }).toEqual({
        fullName: "Sakhe Hlela",
        age: 25,
        dateOfVisit: "2024-06-19",
        timeOfVisit: "14:30",
        comments: "Interested in the program",
        assistantName: "Rose",
      });
    });

    it("should throw an error for invalid fullName", () => {
      expect(
        () =>
          new Visitor(
            "",
            25,
            "2024-06-19",
            "14:30",
            "Interested in the program",
            "Rose"
          )
      ).toThrow(new Error(errorMessages.invalidFullName));
    });

    it("should throw an error for invalid age", () => {
      expect(
        () =>
          new Visitor(
            "Sakhe Hlela",
            -1,
            "2024-06-19",
            "14:30",
            "Interested in the program",
            "Rose"
          )
      ).toThrow(new Error(errorMessages.invalidAge));
    });

    it("should throw an error for invalid date of visit", () => {
      expect(
        () =>
          new Visitor(
            "Sakhe Hlela",
            25,
            "",
            "14:30",
            "Interested in the program",
            "Rose"
          )
      ).toThrow(new Error(errorMessages.invalidDateOfVisit));
    });

    it("should throw an error for invalid time of visit", () => {
      expect(
        () =>
          new Visitor(
            "Sakhe Hlela",
            25,
            "2024-06-19",
            "",
            "Interested in the program",
            "Rose"
          )
      ).toThrow(new Error(errorMessages.invalidTimeOfVisit));
    });

    it("should throw an error for invalid comments", () => {
      expect(
        () => new Visitor("Sakhe Hlela", 25, "2024-06-19", "14:30", "", "Rose")
      ).toThrow(new Error(errorMessages.invalidComments));
    });

    it("should throw an error for invalid assistant name", () => {
      expect(
        () =>
          new Visitor(
            "Sakhe Hlela",
            25,
            "2024-06-19",
            "14:30",
            "Interested in the program",
            ""
          )
      ).toThrow(new Error(errorMessages.invalidAssistantName));
    });
  });

  describe("save", () => {
    it("should save visitor data to a JSON file", () => {
      const visitor = new Visitor(
        "Sakhe Hlela",
        25,
        "2024-06-19",
        "14:30",
        "Interested in the program",
        "Rose"
      );
      visitor.save();

      const expectedFilename = path.join(
        __dirname,
        "../src/visitors/visitor_sakhe_hlela.json"
      );
      const expectedData = JSON.stringify(visitor, null, 4);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expectedFilename,
        expectedData
      );
    });

    it("should create the directory if it does not exist", () => {
      fs.existsSync.and.returnValue(false);
      const visitor = new Visitor(
        "Sakhe Hlela",
        25,
        "2024-06-19",
        "14:30",
        "Interested in the program",
        "Rose"
      );
      visitor.save();

      const expectedDir = path.join(__dirname, "../src/visitors");
      expect(fs.mkdirSync).toHaveBeenCalledWith(expectedDir, { recursive: true });
    });
  });
});

describe("load", () => {
  let originalReadFileSync, originalExistsSync;

  beforeEach(() => {
    originalReadFileSync = fs.readFileSync;
    originalExistsSync = fs.existsSync;

    fs.readFileSync = jasmine.createSpy("readFileSync");
    fs.existsSync = jasmine.createSpy("existsSync");
  });

  afterEach(() => {
    fs.readFileSync = originalReadFileSync;
    fs.existsSync = originalExistsSync;
  });

  it("should load and log visitor data from a JSON file", () => {
    const visitorData = {
      fullName: "Sakhe Hlela",
      age: 25,
      dateOfVisit: "2024-06-19",
      timeOfVisit: "14:30",
      comments: "Interested in the program",
      assistantName: "Rose",
    };

    const expectedFilename = path.join(
      __dirname,
      "../src/visitors/visitor_sakhe_hlela.json"
    );
    fs.existsSync.and.returnValue(true);
    fs.readFileSync.and.returnValue(JSON.stringify(visitorData));

    spyOn(console, "log");

    load("Sakhe Hlela");

    expect(fs.readFileSync).toHaveBeenCalledWith(expectedFilename, "utf8");
    expect(console.log).toHaveBeenCalledWith(visitorData);
  });

  it("should throw an error if visitor file does not exist", () => {
    fs.existsSync.and.returnValue(false);

    expect(() => load("Sakhe Hlela")).toThrow(
      new Error(errorMessages.visitorNotFound("Sakhe Hlela"))
    );
  });
});
