const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');

async function userSignIn(req, res) {

  try{
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 } // 1 hour
    );

    const tokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    }
    res.cookie("token",token,tokenOptions).status(200).json({
      message : "Login successfully",
      token : token,
      data : user,
      success : true,
      error : false
    })
  }catch(error){
    console.error('Error during user sign in:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: true
     });
  }

}

async function userSignUp(req, res) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      role : "General",
      password: hashedPassword,
      isVerified: false,
    });

    await newUser.save();

    res.status(201).json({
      data: newUser,
      message: 'User registered successfully',
      error: false,
    });
  } catch (error) {
    console.error('Error during user sign up:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: true
     });
  }
}


async function userSignout(req, res) {
  try{
    const tokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    };

    res.clearCookie("token", tokenOptions);

    res.json({
      message: "Logout successfully",
      success : true,
      error : false
    })

  }catch(error){
    console.error('Error during user sign out:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: true
    });
  }
}
module.exports = {
  userSignIn,
  userSignUp,
  userSignout
};