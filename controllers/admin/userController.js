const userModel = require('../../models/userModel');

async function getUserAll(req, res) {
  try {
    const allUser = await userModel.find();
    res.status(200).json({
      data: allUser,
      success: 200,
      error: false,
      message:"successfully fetched all users",
    })
  } catch(error){
    console.error('Error during user sign in:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: true
     });
  }

}

async function userDetails(req, res) {
  try{
    console.log("User Details Controller - Authenticated User:", req.user.userId);
    const userId = req.user.userId;
    const user = await userModel.findById(userId);
    // console.log("Fetched User Details:", user);
    res.status(200).json({
      message: 'User details fetched successfully',
      data: user,
      success: true,
      error: false
    });
  }catch(error){
    console.error('Error during user sign in:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: true
     });
  }


}

async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const { name, email, role, address, city, country, phone } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found'});
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.address = address || user.address;
    user.city = city || user.city;
    user.country = country || user.country;
    user.phone = phone || user.phone;

    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      data: user,
      success: true,
      error: false
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error', error: true });
  }
}

module.exports = {
  getUserAll,
  userDetails,
  updateUser
};