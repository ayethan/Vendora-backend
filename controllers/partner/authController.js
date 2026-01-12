const partnerAuthService = require('../../services/partner/partnerAuthService');

const tokenOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
};

async function getPartnerDetails(req, res) {
    try {
        const userId = req.user.id || req.user.userId;
        const { user, restaurant } = await partnerAuthService.getDetails(userId);

        res.status(200).json({
            message: 'Partner details fetched successfully',
            data: { user, restaurant },
            success: true,
            error: false
        });
    } catch (error) {
        console.error('Error fetching partner details:', error);
        res.status(404).json({
            message: error.message || 'Internal server error',
            error: true
        });
    }
}

async function partnerSignIn(req, res) {
  try {
    const { email, password } = req.body;
    const { user, restaurant, token } = await partnerAuthService.signIn(email, password);

    res.cookie("restaurant_token", token, tokenOptions).status(200).json({
      message: "Partner login successful",
      token: token,
      data: {
        user,
        restaurant
      },
      success: true,
      error: false
    });
  } catch (error) {
    console.error('Error during partner sign in:', error);
    res.status(400).json({
      message: error.message || 'Internal server error',
      error: true
    });
  }
}

async function partnerSignOut(req, res) {
  const tokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  };
  try {
    res.clearCookie("restaurant_token", tokenOptions);
    res.json({
      message: "Partner logout successfully",
      success: true,
      error: false
    });
  } catch (error) {
    console.error('Error during partner sign out:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: true
    });
  }
}

module.exports = {
  getPartnerDetails,
  partnerSignIn,
  partnerSignOut
};