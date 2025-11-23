const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);
   res.cookie("token", token, {
  httpOnly: true,      // more secure
  secure: true,       // use true if using HTTPS
  sameSite: "none",     // helps prevent CSRF
});

    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
   
  } catch (error) {
    console.error(error);
  }
};
module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if(!email || !password ){
      return res.json({message:'All fields are required'})
    }
    const user = await User.findOne({ email });
    if(!user){
      return res.json({message:'Incorrect password or email' }) 
    }
    const auth = await bcrypt.compare(password,user.password)
    if (!auth) {
      return res.json({message:'Incorrect password or email' }) 
    }
     const token = createSecretToken(user._id);
     res.cookie("token", token, {
     httpOnly: true,      // more secure
     secure: true,       // use true if using HTTPS
     sameSite: "none",     // helps prevent CSRF
     });

     res.status(201).json({ message: "User logged in successfully", success: true });
    
    } catch (error) {
    console.error(error);
    }
   };

   // In AuthController.js

module.exports.Logout = (req, res) => {
  // clearCookie ka istemal karein
  res.clearCookie('token', {
    httpOnly: true,
    secure: false, // Development ke liye false, Production (HTTPS) ke liye true
    sameSite: 'none',
    // path: '/' // Agar aapne login ke waqt path set kiya tha to yahan bhi karein
  });
  
  res.status(200).json({ success: true, message: "Logged out successfully" });
}