const userModel = require('../../models/userModel');
async function getUserDetails(req, res) {
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

module.exports = getUserDetails;