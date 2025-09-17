const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json()); // parse JSON bodies
app.use(cors());         // allow frontend requests

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Exodus_Wallet", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// Schema & Model
const depositSchema = new mongoose.Schema({
  userAddress: { type: String, required: true },
  tokenAddress: { type: String, required: true },
  amount: { type: Number, required: true },
  time: { type: Date, default: Date.now },
});

const withdrawlSchema = new mongoose.Schema({
  userAddress: { type: String, required: true },
  tokenAddress: { type: String, required: true },
  amount: { type: Number, required: true },
  time: { type: Date, default: Date.now },
});

const transferSchema = new mongoose.Schema({
  senderAddress: { type: String, required: true },
  receiverAddress: { type: String, required: true },
  tokenAddress: { type: String, required: true },
  amount: { type: Number, required: true },
  time: { type: Date, default: Date.now },
});

const swapSchema = new mongoose.Schema({
  userAddress: { type: String, required: true },
  fromToken: { type: String, required: true },
  toToken: { type: String, required: true },
  amount: { type: Number, required: true },
  time: { type: Date, default: Date.now },
});

const stakeSchema = new mongoose.Schema({
  userAddress: { type: String, required: true },
  tokenAddress: { type: String, required: true },
  activity: {type: String, required:true},
  amount: { type: Number, required: true },
  time: { type: Date, default: Date.now },
});

const claimSchema = new mongoose.Schema({
  userAddress: { type: String, required: true },
  tokenAddress: { type: String, required: true },
  amount: { type: Number, required: true },
  time: { type: Date, default: Date.now },
});

// Models Declaration
const Deposit = mongoose.model("Deposit", depositSchema);
const Withdrawl= mongoose.model("Withdrawl", withdrawlSchema);
const Transfer= mongoose.model("Transfer", transferSchema);
const Swap= mongoose.model("Swap", swapSchema);
const Stake= mongoose.model("Stake", stakeSchema);
const Claim= mongoose.model("Claim", claimSchema);

app.post("/api/deposit", async (req, res) => {
  try {
    const { userAddress, tokenAddress, amount } = req.body;

    const newDeposit = new Deposit({
      userAddress,
      tokenAddress,
      amount,
    });

    await newDeposit.save();
    res.json({ success: true, data: newDeposit });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/withdrawl", async (req, res) => {
  try {
    const { userAddress, tokenAddress, amount } = req.body;

    const newWithdrawl = new Withdrawl({
      userAddress,
      tokenAddress,
      amount,
    });

    await newWithdrawl.save();
    res.json({ success: true, data: newWithdrawl });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/transfer", async (req, res) => {
  try {

    // console.log(req.body);
    const { senderAddress, receiverAddress, tokenAddress, amount } = req.body;

    const newTransfer = new Transfer({
      senderAddress,
      receiverAddress,
      tokenAddress,
      amount,
    });

    await newTransfer.save();
    res.json({ success: true, data: newTransfer });
  } catch (err) {
    console.error("❌ Transfer Save Error:", err);   // 👈 log full error
    res.status(500).json({ success: false, error: err.message });
  }
});


app.post("/api/swap", async (req, res) => {
  try {

    // console.log(req.body);
    const { userAddress, fromToken, toToken, amount } = req.body;

    const newSwap = new Swap({
      userAddress,
      fromToken,
      toToken,
      amount
    });

    await newSwap.save();
    res.json({ success: true, data: newSwap });
  } catch (err) {
    console.error("❌ Transfer Save Error:", err);   // 👈 log full error
    res.status(500).json({ success: false, error: err.message });
  }
});


app.post("/api/stake", async (req, res) => {
  try {
    console.log(req.body);
    const { userAddress, tokenAddress, activity, amount } = req.body;

    const newStake = new Stake({
      userAddress,
      tokenAddress,
      activity,
      amount
    });

    await newStake.save();
    res.json({ success: true, data: newStake });
  } catch (err) {
    console.error("❌ Transfer Save Error:", err);   // 👈 log full error
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/claim", async (req, res) => {
  try {
    console.log(req.body);
    const { userAddress, tokenAddress, amount } = req.body;

    const newClaim = new Claim({
      userAddress,
      tokenAddress,
      amount
    });

    await newClaim.save();
    res.json({ success: true, data: newClaim });
  } catch (err) {
    console.error("❌ Transfer Save Error:", err);   // 👈 log full error
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/deposit", async(req, res) => {
  try{
    const depositData=await Deposit.find();
    res.json(depositData);
  }
  catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
})

app.get("/api/withdrawl", async(req, res) => {
  try{
    const withdrawlData=await Withdrawl.find();
    res.json(withdrawlData);
  }
  catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
})

app.get("/api/transfer", async(req, res) => {
  try{
    const transferData=await Transfer.find();
    res.json(transferData);
  }
  catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
})

app.get("/api/swap", async(req, res) => {
  try{
    const swapData=await Swap.find();
    res.json(swapData);
  }
  catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
})

app.get("/api/stake", async(req, res) => {
  try{
    const stakeData=await Stake.find();
    res.json(stakeData);
  }
  catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
})

app.get("/api/claim", async(req, res) => {
  try{
    const claimData=await Claim.find();
    res.json(claimData);
  }
  catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
})

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
