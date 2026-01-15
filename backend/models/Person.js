import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: String,
  streetName: String,
  location: String,
  date: Date,
});

export default mongoose.model("Person", personSchema);
