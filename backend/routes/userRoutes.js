import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const peoplePath = path.resolve("data/people.json");

// Read people from JSON safely
const readPeople = () => {
  try {
    // If file doesn’t exist, create an empty array
    if (!fs.existsSync(peoplePath)) {
      fs.writeFileSync(peoplePath, JSON.stringify([]));
    }

    const data = fs.readFileSync(peoplePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading people.json:", err);
    return [];
  }
};

// Get all people for users (no auth)
router.get("/people", (req, res) => {
  const people = readPeople();
  res.json(people);
});

export default router;

