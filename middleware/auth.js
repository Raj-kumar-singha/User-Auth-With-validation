const Session = require('../models/session');
const utils = require('../utils')

const token = async (req, res, next) => {
    let unauthorizedCode = 'UNAUTHORIZED';

    const authToken = req.headers && req.headers["x-access-token"]
    if (authToken) {
        await Session.findOne({
            token: authToken,
            status: 'Active'
        }).populate('user').then(async response => {
            if (response && !utils.isJWTExpired(response.token)) {
                req.user = response.user
                next();
            } else {
                if (response && utils.isJWTExpired(response.token)) {
                    await Session.updateOne({ token: authToken }, { $set: { status: 'Expired' } })
                }
                res.status(401).send({
                    success: false,
                    error: {
                        code: unauthorizedCode,
                        message: response ? 'Token Expired' : 'Invalid authorization header'
                    }
                })
            }
        }).catch(err => {
            res.status(401).send({
                success: false,
                error: err?.message || 'Server error'
            })
        })
    } else {
        res.status(401).send({
            success: false,
            error: {
                code: unauthorizedCode,
                message: "Invalid authorization header"
            }
        });
    }
}

module.exports = { token }