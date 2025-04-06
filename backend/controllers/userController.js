const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id, email) => {
  return jwt.sign(
    { _id: id, email: email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Register
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Account already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();
    const token = generateToken(user._id, user.email);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // Adjusted for cross-origin
    });

    res.setHeader('Authorization', `Bearer ${token}`);

    res.status(201).json({
      status: 'success',
      user: { _id: user._id, name: user.name, role: user.role, profilePic: 'https://res.cloudinary.com/dnuqb888u/image/upload/v1742686168/bc7a0c399990de122f1b6e09d00e6c4c_vixq5b.jpg' }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user._id, user.email);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none", 
    });

    res.setHeader('Authorization', `Bearer ${token}`);


    console.log("Cookie set with token:", token);

    res.json({
      token: token,
      status: 'success',
      user: { id: user._id, name: user.name, role: user.role, profilePic: user.profilePic }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get User (Simplified with Middleware)
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
const updateUser = async(req, res)=>{
  try{
    console.log('user: ', req.user._id);
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {new: true});
    if(!updatedUser){
      return res.status(404).json({message: "User not found"});
    }
    res.status(200).json(updatedUser);
  }catch(error){
    res.status(500).json({message: error.message});
  }
}
module.exports = {updateUser, register, login, getUser };