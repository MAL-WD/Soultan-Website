import { sendTelegramContactMessage } from '../utils/telegramNotifier.js';

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
export const submitContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and message',
            });
        }

        // Send Telegram notification (fire-and-forget)
        sendTelegramContactMessage({ name, email, subject, message });

        res.status(200).json({
            success: true,
            message: 'Contact message received successfully',
        });
    } catch (error) {
        console.error('Submit Contact Error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
