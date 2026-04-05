import User from '../Models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/token.js';


export const registerUser = async(req, res)=>{
  try {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
      return res.status(400).json({message: 'Please fill all the fields'});
    }

    const user = await User.findOne({email});
    if(user){
      return res.status(400).json({message: 'User already exists'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({name, email, password: hashedPassword});

    const token = generateToken(newUser._id);
    if(!token){
      return res.status(500).json({message:'Error generating token'});
    }
    res.cookie("token", token,{
      httpOnly:true,
      secure:false,
      sameSite:"lax",
      maxAge: 3600000
    })
const { password: _, ...safeUser } = newUser._doc;
    return res.status(201).json({message: 'User registered successfully', user: safeUser});

  } catch (error) {
    console.error(error); // ADD THIS
  return res.status(500).json({message: error.message});
  }
}


export const loginUser = async(req, res)=>{
  try{
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(400).json({message: 'Please fill all the fields'});
    }
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message: 'Invalid credentials'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({message: 'Invalid credentials'});
    }

    const token = generateToken(user._id);
    if(!token){
      return res.status(500).json({message:'Error generating token'});
    }
    res.cookie("token", token,{
      httpOnly:true,
      secure:false,
      sameSite:"lax",
      maxAge: 3600000
    });
    const { password: _, ...safeUser } = user._doc;
    return res.status(200).json({
      success:true,
      message: 'User logged in successfully', 
      user:safeUser
    });

  } catch(error){
    console.error("LOGIN ERROR:", error);  // ⭐ ADD THIS
  return res.status(500).json({
    message: error.message   // ⭐ show real error
  });
  }
}


export const logoutUser = async(req, res)=>{
  try{
    res.clearCookie("token");
    return res.status(200).json({message: 'User logged out successfully'});
  } catch(error){
    return res.status(500).json({message: 'Internal server error'});
  }
}
