const User = require('../models/userModel');
const ForgotPasswordRequest = require('../models/forgotPasswordModel');
var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;
const bcrypt = require('bcrypt');
require('dotenv').config();


var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).json({ Error: 'User not found' });
        }

        const forgotPasswordRequest = await ForgotPasswordRequest.create({ userId: user.id });

        const resetUrl = `http://localhost:7000/password/resetpassword/${forgotPasswordRequest.id}`;

        var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.to = [{ "email": email }];
        sendSmtpEmail.sender = { "name": "Expense Tracker", "email": "krisurajdec@gmail.com" };
        sendSmtpEmail.subject = "Reset your password";
        sendSmtpEmail.htmlContent = `<html><body><p>Click the <a href="${resetUrl}">link</a> to reset your password</p></body></html>`;

        apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
            console.log('API called successfully. Returned data: ' + data);
            return res.status(200).json({ message: 'Password reset email sent successfully' });
        }, function (error) {
            console.error(error);
            return res.status(500).json({ Error: 'Error sending password reset email' });
        });
    } catch (error) {
        return res.status(500).json({ Error: 'Sending password link' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        const forgotPasswordRequest = await ForgotPasswordRequest.findOne({ where: { id: id, isActive: true } });

        if (!forgotPasswordRequest) {
            return res.status(400).json({ Error: 'Invalid or expired password reset link' });
        }

        const user = await User.findOne({ where: { id: forgotPasswordRequest.userId } });
        if (!user) {
            return res.status(404).json({ Error: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        forgotPasswordRequest.isActive = false;
        await forgotPasswordRequest.save();

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        return res.status(500).json({ Error: 'Error resetting password' });
    }
};

