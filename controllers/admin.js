
const Business = require('../models/businessSchema');

// Get all businesses
const getAllBusiness=async (req, res) => {
    try {
      const businesses = await Business.find();
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
const updateBusinessStatus = async(req,res)=>{
 try {
    const businessId = req.params.id;
    const newStatus = req.body.status;
    if(!(newStatus ==='approved' || newStatus==='rejected' || newStatus==='pending')){
      return res.status(404).json({error: 'This status cannot be listed'})
    }
    // Find the business by ID
    const business = await Business.findById(businessId);
    if (!business) {
     return res.status(404).json({error: 'Business not found'})
    }
    business.business_status = newStatus;

    const updatedBusiness = await business.save();

    // Return the updated business document in the response to the client
    res.status(200).json({updatedBusiness,message: 'status updated succesfully'});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
module.exports = {getAllBusiness, updateBusinessStatus}