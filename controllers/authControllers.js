const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const RefreshTokenModel = require('../models/RefreshToken');

const authControllers = {
    registerUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username })

            if (user) {
                return res.status(400).json({ message: 'Username already taken' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            await User.create({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            })
            res.status(200).json({ message: 'User created successfully' })

        } catch (error) {
            res.status(500).json({ message: 'Internal server error' })
        }
    },
    generatateAccessToken: (user) => {
        return jwt.sign({
            id: user._id,
            admin: user.admin
        },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: '30d' }
        )
    },
    generatateRefreshToken: (user) => {
        return jwt.sign({
            id: user._id,
            admin: user.admin
        },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: '365d' }
        )
    },
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(404).json({ message: 'Invalid username!' });
            }

            const validPassword = await bcrypt.compare(req.body.password, user.password);

            if (!validPassword) {
                return res.status(400).json({ message: 'Wrong password!' });
            }
            if (user && validPassword) {
                const accessToken = authControllers.generatateAccessToken(user);
                /*  const refreshToken = authControllers.generatateRefreshToken(user);
 
                 const token = await RefreshTokenModel.findOne({ user: user._id });
                 if (!token) {
                     await RefreshTokenModel.create({
                         token: refreshToken,
                         user: user._id
                     })
                 }
                 else {
                     await RefreshTokenModel.findOneAndUpdate({ user: user._id }, { token: refreshToken }, { new: true })
                 } */

                userReturn = user.toObject();
                delete userReturn.password;

                return res.status(200).json({ ...userReturn, accessToken });
            }
        } catch (error) {
            res.status(500).json(error)
        }
    },
    requestRefreshToken: async (req, res) => {

        const refreshToken = JSON.parse(window.localStorage.getItem('currentUser')).refreshToken;

        if (!refreshToken) return res.sendStatus(401);
        const token = await RefreshTokenModel.findOne({ token: refreshToken });
        if (!token) {
            return res.sendStatus(403)
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, data) => {
            if (err) return res.sendStatus(403)

            const newAccessToken = authControllers.generatateAccessToken({ username: data.username, admin: data.admin });

            res.status(200).json({ accessToken: newAccessToken });
        })
    },
    logoutUser: async (req, res) => {
        try {
            /* await RefreshTokenModel.findOneAndDelete({ token: req.cookies.refreshToken });
            res.clearCookie("refreshToken"); */
            res.status(200).json('Logout success');
        } catch (error) {
            res.sendStatus(500);
        }
    }
}
module.exports = authControllers;