const fs = require("fs");
const path = require("path");

const errorMessages = {
  invalidFullName: "Full name must be a non-empty string.",
  invalidAge: "Age must be a positive number.",
  invalidDateOfVisit: "Date of visit must be a non-empty string.",
  invalidTimeOfVisit: "Time of visit must be a non-empty string.",
  invalidComments: "Comments must be a non-empty string.",
  invalidAssistantName: "Assistant name must be a non-empty string.",
  visitorNotFound: (name) => `No visitor found with name ${name}`,
};

class Visitor {
  constructor(
    fullName,
    age,
    dateOfVisit,
    timeOfVisit,
    comments,
    assistantName
  ) {
    this.validate(
      fullName,
      age,
      dateOfVisit,
      timeOfVisit,
      comments,
      assistantName
    );

    this.fullName = fullName;
    this.age = age;
    this.dateOfVisit = dateOfVisit;
    this.timeOfVisit = timeOfVisit;
    this.comments = comments;
    this.assistantName = assistantName;
  }

  validate(fullName, age, dateOfVisit, timeOfVisit, comments, assistantName) {
    const stringFields = {
      fullName,
      dateOfVisit,
      timeOfVisit,
      comments,
      assistantName,
    };

    for (const [key, value] of Object.entries(stringFields)) {
      if (typeof value !== "string" || value.trim() === "") {
        throw new Error(
          errorMessages[`invalid${key.charAt(0).toUpperCase() + key.slice(1)}`]
        );
      }
    }

    if (typeof age !== "number" || age <= 0) {
      throw new Error(errorMessages.invalidAge);
    }
  }

  save() {
    const filename = Visitor.getFileName(this.fullName);
    const visitorData = this;

    const dir = path.dirname(filename);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filename, JSON.stringify(visitorData, null, 4));
  }

  static getFileName(fullName) {
    return path.join(
      __dirname,
      "visitors",
      `visitor_${Visitor.formatName(fullName)}.json`
    );
  }

  static formatName(name) {
    return name.toLowerCase().replace(/ /g, "_");
  }
}

function load(fullName) {
  if (typeof fullName !== "string" || fullName.trim() === "") {
    throw new Error(errorMessages.invalidFullName);
  }

  const filename = Visitor.getFileName(fullName);

  if (!fs.existsSync(filename)) {
    throw new Error(errorMessages.visitorNotFound(fullName));
  }

  const visitorData = JSON.parse(fs.readFileSync(filename, "utf8"));
  console.log(visitorData);
}

module.exports = { Visitor, load, errorMessages };