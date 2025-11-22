const userModel = require('../../models/userModel');
async function userDetailsController(req, res) {
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

module.exports = userDetailsController;