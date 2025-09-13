// utils/uniqueCode.js
const Counter = require("../models/counter");

async function getNextUniqueCode(sequenceName) {
  const counter = await Counter.findOneAndUpdate(
    { name: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq.toString(); // ensures it's always string
}

module.exports = { getNextUniqueCode };
