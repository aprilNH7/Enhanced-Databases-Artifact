const Contact = require('../database/models/contact');

exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const newContact = new Contact({
            name,
            email,
            subject,
            message,
        });

        await newContact.save();

        res.status(201).send('Your message has been sent successfully');
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).send('There was an error submitting your message');
    }
};
