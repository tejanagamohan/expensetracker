require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db"); // MongoDB connection
const Transaction = require("./models/transaction"); // Transaction model

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.get("/data", async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    res.json({ table: transactions });
  } catch (err) {
    console.error("Database read failed:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add", async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body.data);
    await newTransaction.save();
    console.log("New transaction added");
    res.redirect("/");
  } catch (err) {
    console.error("Failed to save transaction:", err);
    res.status(500).send("Internal Server Error");
  }
});

const port = process.env.PORT ;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
