const talksStore = require('../store/talks');
const { validateTalkData } = require('../utils/validation');
const {
  createErrorResponse,
  createValidationErrorResponse,
  createNotFoundErrorResponse,
  asyncHandler,
  HTTP_STATUS
} = require('../utils/errorHandler');

// Get all talks
exports.getAllTalks = asyncHandler(async (req, res) => {
  const talks = talksStore.findAll();
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: { talks },
    count: talks.length
  });
});

// Get talk by ID
exports.getTalkById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id || typeof id !== 'string') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      createErrorResponse('Invalid talk ID format', HTTP_STATUS.BAD_REQUEST, 'INVALID_ID')
    );
  }
  
  const talk = talksStore.findById(id);
  if (!talk) {
    return res.status(HTTP_STATUS.NOT_FOUND).json(
      createNotFoundErrorResponse('Talk')
    );
  }
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: { talk }
  });
});

// Create a new talk
exports.createTalk = asyncHandler(async (req, res) => {
  // Validate input data
  const validation = validateTalkData(req.body);
  if (!validation.isValid) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      createValidationErrorResponse(validation.errors)
    );
  }
  
  const newTalk = talksStore.create(req.body);
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Talk created successfully',
    data: { talk: newTalk }
  });
});

// Update a talk
exports.updateTalk = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id || typeof id !== 'string') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      createErrorResponse('Invalid talk ID format', HTTP_STATUS.BAD_REQUEST, 'INVALID_ID')
    );
  }
  
  // Validate input data
  const validation = validateTalkData(req.body);
  if (!validation.isValid) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      createValidationErrorResponse(validation.errors)
    );
  }
  
  const updatedTalk = talksStore.update(id, req.body);
  if (!updatedTalk) {
    return res.status(HTTP_STATUS.NOT_FOUND).json(
      createNotFoundErrorResponse('Talk')
    );
  }
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Talk updated successfully',
    data: { talk: updatedTalk }
  });
});

// Delete a talk
exports.deleteTalk = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id || typeof id !== 'string') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      createErrorResponse('Invalid talk ID format', HTTP_STATUS.BAD_REQUEST, 'INVALID_ID')
    );
  }
  
  const talk = talksStore.findById(id);
  if (!talk) {
    return res.status(HTTP_STATUS.NOT_FOUND).json(
      createNotFoundErrorResponse('Talk')
    );
  }
  
  const result = talksStore.delete(id);
  if (result) {
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Talk deleted successfully'
    });
  } else {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to delete talk', HTTP_STATUS.INTERNAL_SERVER_ERROR, 'DELETE_FAILED')
    );
  }
});