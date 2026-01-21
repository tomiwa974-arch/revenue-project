import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  streetName: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
});

export default mongoose.model("Person", personSchema);

