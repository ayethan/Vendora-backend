const userModel = require('../../models/userModel');

async function updateUserController(req, res) {
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

module.exports = updateUserController;
