const db = require("../db");
const bcrypt = require("bcrypt");

const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;


const register = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Weak password" });
    }
    const [existing] = await db.query(
      "SELECT * FROM users WHERE userName=?",
      [userName]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (userName, password) VALUES (?, ?)",
      [userName, hashed]
    );
    req.session.userId = result.insertId;
    res.status(200).json({ message: "Registered successfully" });
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const [users] = await db.query(
      "SELECT * FROM users WHERE userName=?",
      [userName]
    );
    if (users.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }
    req.session.userId = user.id;
    res.json({ message: "Login successful" });
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
};

module.exports = { register, login, logout };