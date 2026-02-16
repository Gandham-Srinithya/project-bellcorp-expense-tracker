import express from "express";
import Transaction from "../models/Transaction.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  const transaction = await Transaction.create({
    ...req.body,
    user: req.user.id
  });

  res.json(transaction);
});

router.get("/", verifyToken, async (req, res) => {
  const {
    page = 1,
    limit = 5,
    search,
    category
  } = req.query;

  let query = { user: req.user.id };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { notes: { $regex: search, $options: "i" } }
    ];
  }

  if (category) query.category = category;

  const total = await Transaction.countDocuments(query);

  const transactions = await Transaction.find(query)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    transactions,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page)
  });
});

router.put("/:id", verifyToken, async (req, res) => {
  const updated = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  res.json(updated);
});

router.delete("/:id", verifyToken, async (req, res) => {
  await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });
  res.json({ message: "Deleted successfully" });
});

export default router;
