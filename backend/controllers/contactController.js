const { sendContactEmail, generateTicketId } = require('../services/emailService');
const db = require('../models');
const { Ticket } = db;

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public (or Private if you want only logged-in users)
const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message, priority = 'Medium' } = req.body;
    
    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (name.length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    }

    if (message.length < 10) {
      return res.status(400).json({ message: 'Message must be at least 10 characters' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ message: 'Message must not exceed 1000 characters' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Generate unique ticket ID
    const ticketId = generateTicketId();

    // Send emails
    await sendContactEmail({
      name,
      email,
      subject,
      message,
      priority,
      ticketId
    });

    // Optional: Save to database
    // if (Ticket) {
    //   await Ticket.create({
    //     ticketId,
    //     name,
    //     email,
    //     subject,
    //     message,
    //     priority,
    //     userId: req.user?.id || null
    //   });
    // }

    res.status(201).json({
      message: 'Message sent successfully',
      ticketId,
      responseTime: '24-48 hours'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
};

// @desc    Get user's tickets (optional)
// @route   GET /api/contact/tickets
// @access  Private
const getUserTickets = async (req, res) => {
  try {
    if (!Ticket) {
      return res.status(404).json({ message: 'Ticket system not available' });
    }

    const tickets = await Ticket.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(tickets);
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  submitContactForm,
  getUserTickets
};
