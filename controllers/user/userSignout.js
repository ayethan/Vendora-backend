
async function userSignoutController(req, res) {
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

module.exports = userSignoutController;