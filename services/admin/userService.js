const userModel = require('../../models/userModel');

class UserService {
  async getDetails(userId) {
    if (!userId) {
      throw new Error('User ID must be provided.');
    }
    const user = await userModel.findById(userId).populate('addresses');
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }
}

module.exports = new UserService();