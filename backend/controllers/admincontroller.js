// backend/controllers/adminController.js
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminPath = path.resolve("data/admin.json");

// Admin login
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!fs.existsSync(adminPath)) {
    return res.status(500).json({ success: false, message: "Admin file missing" });
  }

  const adminData = JSON.parse(fs.readFileSync(adminPath));

  // Check username
  if (username !== adminData.name) {
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }

  // Check password
  const match = await bcrypt.compare(password, adminData.password);
  if (!match) {
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }

  // Generate JWT token
  const token = jwt.sign({ name: adminData.name }, "secretkey", { expiresIn: "1h" });

  res.json({ success: true, token });
};

// Get all people
export const getPeople = (req, res) => {
  const peoplePath = path.resolve("data/people.json");
  if (!fs.existsSync(peoplePath)) fs.writeFileSync(peoplePath, "[]");
  const people = JSON.parse(fs.readFileSync(peoplePath));
  res.json(people);
};

// Add person
export const addPerson = (req, res) => {
  const peoplePath = path.resolve("data/people.json");
  if (!fs.existsSync(peoplePath)) fs.writeFileSync(peoplePath, "[]");

  const people = JSON.parse(fs.readFileSync(peoplePath));
  const newPerson = { _id: Date.now().toString(), ...req.body };
  people.push(newPerson);
  fs.writeFileSync(peoplePath, JSON.stringify(people, null, 2));
  res.json(newPerson);
};

// Update person
export const updatePerson = (req, res) => {
  const { id } = req.params;
  const peoplePath = path.resolve("data/people.json");
  const people = JSON.parse(fs.readFileSync(peoplePath));
  const index = people.findIndex((p) => p._id === id);
  if (index === -1) return res.status(404).json({ message: "Person not found" });

  people[index] = { ...people[index], ...req.body };
  fs.writeFileSync(peoplePath, JSON.stringify(people, null, 2));
  res.json(people[index]);
};

// Delete person
export const deletePerson = (req, res) => {
  const { id } = req.params;
  const peoplePath = path.resolve("data/people.json");
  let people = JSON.parse(fs.readFileSync(peoplePath));
  people = people.filter((p) => p._id !== id);
  fs.writeFileSync(peoplePath, JSON.stringify(people, null, 2));
  res.json({ message: "Deleted successfully" });
};


