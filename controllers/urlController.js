const Url = require('../models/urlModel');

exports.postUrl = async (req, res) => {
    try {
        const userId = req.userId;
        const { url } = req.body;
        const rurl = await Url.create({ url: url, userId: userId });
        return res.status(201).json({ message: 'Url successfully posted to DB', rurl });
    } catch (error) {
        return res.status(500).json({ error: 'Error posting url to DB' });
    }
};

exports.getUrls = async (req, res) => {
    try {
        const userId = req.userId;
        const urls = await Url.findAll({ where: { userId: userId } });
        return res.status(200).json({ message: 'Successfully fetched url from DB', urls });
    } catch (error) {
        return res.status(500).json({ error: 'Error getting urls from DB' });
    }
};
