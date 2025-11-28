const  useModel  =  require('../models/userModel');

async function adminPermission(userId){
    try {
        const user = await useModel.findById(userId);
        if(user && user.role === 'Admin'){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        console.error("Error checking admin permission:", error);
        return false;
    }

}

module.exports = { adminPermission };