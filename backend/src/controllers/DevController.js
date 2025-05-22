const axios = require('axios')
const Dev = require('../models/Dev')

module.exports = {
    async index(req, res) {
        const { user } = req.headers

        const loggedDev = await Dev.findById(user)

        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } },
                { _id: { $nin: loggedDev.likes } },
                { _id: { $nin: loggedDev.dislikes } },
            ]
        })

        return res.json(users)
    },

    async store(req, res) {

        try {
            const { github_username } = req.body

            if (!github_username) {
                return res.status(400).json({ error: 'Username not provided' })
            }

            let userExists = await Dev.findOne({ user: github_username })

            if (userExists) {
                return res.json(userExists)
            }

            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)

            const { name, login, avatar_url, bio } = apiResponse.data

            let dev
            try {
                dev = await Dev.create({
                    name: name || login,
                    user: login,
                    bio: bio || 'No bio available',
                    avatar: avatar_url,
                })
            } catch (err) {
                // If duplicate key error, fetch the existing user
                if (err.code === 11000) {
                    dev = await Dev.findOne({ user: login })
                } else {
                    throw err
                }
            }

            return res.status(201).json(dev)
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return res.status(400).json({ error: 'User not found' })
            }
            console.error(error)
            return res.status(500).json({ error: 'Internal server error' })
        }

    }
}