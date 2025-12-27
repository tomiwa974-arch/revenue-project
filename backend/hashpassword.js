import bcrypt from "bcrypt";

const password = "admin123"; // the password you want
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) console.error(err);
  else console.log("Hashed password:", hash);
});
