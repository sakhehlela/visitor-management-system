Node & File IO (280)
For raw project instructions see: http://syllabus.africacode.net/projects/nodejs/file-io/


# Visitor Management System

## Project Overview

The **Visitor Management System** is a backend service designed to capture basic information about prospective students visiting Umuzi. This project involves storing and retrieving information from JSON files, allowing staff to manage visitor data efficiently.

## Class: Visitor

The `Visitor` class represents a visitor with the following properties:

- **fullName**: The full name of the visitor.
- **age**: The age of the visitor.
- **dateOfVisit**: The date when the visitor arrives.
- **timeOfVisit**: The time of the visit.
- **comments**: Any additional comments from the visitor.
- **assistedBy**: The name of the staff member who assisted the visitor.

### Methods

#### `save()`

This method saves the visitor’s data to a JSON file. The filename is formatted as `visitor_{full_name}.json`, where spaces are replaced with underscores and the name is in lowercase.

**Example:**
```javascript
const alice = new Visitor("Alice Cooper", 25, "2024-09-30", "10:00 AM", "Looking for courses.", "John Doe");
alice.save(); // Creates a file named visitor_alice_cooper.json
