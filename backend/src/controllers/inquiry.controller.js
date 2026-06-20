import { Inquiry } from '../models/Inquiry.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const INQUIRY_RECEIVER_EMAIL = 'therahulsharma15@gmail.com';

export const createInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.create({
    ...req.body,
    receiverEmail: INQUIRY_RECEIVER_EMAIL,
  });

  return res.status(201).json({
    success: true,
    message: 'Inquiry submitted successfully',
    data: inquiry,
  });
});
