const express = require("express");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();

const authRoutes=require("./routes/auth.js");
const expenses=require("./routes/expenses.js");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,                
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true, 
      sameSite: "none"
    }
  })
);

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.use("/", authRoutes);
app.use("/expenses", expenses);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

(async () => {
  try {
    
    console.log("DB Connected");
  } catch (err) {
    console.log(err);
  }
})();
