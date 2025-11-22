const {mongoose,Schema}=require("mongoose");

const OrderSchema=new Schema({
    name:String,
    qty:Number,
    price:Number,
    mode:String
})

module.exports=mongoose.model("Order",OrderSchema);
