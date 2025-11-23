 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = 4000;
const { MONGO_URL } = process.env;

// ==============================
//  Models
// ==============================
const  HoldingsModel  = require("../Models/HoldingModel");
const OrdersModel = require("../Models/OrdersSchema");
const  PositionsModel = require("../Models/PositionsSchema");

// ==============================
//  Routes
// ==============================
const authRoute = require("../Routes/AuthRoute");

// ==============================
//  Middlewares
// ==============================
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = ["http://localhost:3000","https://stock-monitoring-frontend.vercel.app"];
app.use(
  cors({
    origin: (origin, callback) => {
       if(!origin) return callback(null,true);

       const isAllowed = allowedOrigins.includes(origin);
       if(isAllowed){
        return callback(null,true);
       }
       console.warn(`CORS policy: Origin ${origin} not allowed`);
       return callback(new Error("CORS policy: This origin is not allowed"));
    },
    credentials: true,
  })
);

// ==============================
//  API Endpoints
// ==============================

// 🔹 Fetch all holdings
app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
    // console.log(allHoldings)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});

// 🔹 Fetch all positions
app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});
app.get("/newOrders",async(req,res)=>{
  try{
    const orders=await OrdersModel.find({});
    
    res.json(orders);
  }catch(err){
 
    res.status(500).json({error:"Failed to fetch orders"});
  }
});
// 🔹 Create a new order
app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    const newOrder = new OrdersModel({ name, qty, price, mode });
    await newOrder.save();
    res.send("Order saved successfully!");
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// 🔹 Auth routes
app.use("/", authRoute);

 
let isConnected=false;
async function connectToMongoDB(){
  try{
    await mongoose.connect(process.env.MONGO_URL,{
      useNewUrlParser:true,
      useUnifiedTopology:true,
    });
    isConnected=true;
    console.log("✅ MongoDB connected successfully");
  }catch(err){
    console.error("❌ MongoDB connection error:",err);
  }
} 

//add middleware
app.use((req,res,next)=>{
  if(!isConnected){
    connectToMongoDB().then(()=>{
      next();
    });
  }
})


//  Server Start
//  app.listen(PORT, "localhost", () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });

export default app;
