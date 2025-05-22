const { Talk } = require('../models');

// Get all talks
exports.getAllTalks = async (req, res, next) => {
  try {
    const talks = await Talk.findAll({
      order: [['startTime', 'ASC']],
    });
    
    return res.status(200).json({
      success: true,
      data: talks,
    });
  } catch (error) {
    next(error);
  }
};

// Get talk by ID
exports.getTalkById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const talk = await Talk.findByPk(id);
    
    if (!talk) {
      return res.status(404).json({
        success: false,
        message: `Talk with id ${id} not found`,
      });
    }
    
    return res.status(200).json({
      success: true,
      data: talk,
    });
  } catch (error) {
    next(error);
  }
};