import Admin from "../models/Admin.js";
import Person from "../models/Person.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ADMIN LOGIN */
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password required"
      });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token
    });
  } catch (err) {
    console.error("Admin login error FULL:", err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ====== CRUD FOR PEOPLE ====== */

// Get all people
export const getPeople = async (req, res) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new person
export const addPerson = async (req, res) => {
  try {
    const { name, streetName, location, date } = req.body;

    const newPerson = new Person({
      name,
      streetName,
      location,
      date,
    });

    const saved = await newPerson.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update person
export const updatePerson = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, streetName, location, date } = req.body;

    const updated = await Person.findByIdAndUpdate(
      id,
      { name, streetName, location, date },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete person
export const deletePerson = async (req, res) => {
  try {
    const { id } = req.params;
    await Person.findByIdAndDelete(id);
    res.json({ message: "Person deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


