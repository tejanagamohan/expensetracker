const mongoose = require("mongoose");
// import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  date: String,
  description: String,
  amount: Number,
  category: String,
  type: String,
  time: String,
});

module.exports = mongoose.model("Transaction", TransactionSchema);
