const Post = require('../models/Posts');

const postController = {
    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.find({ user: req.userId }).populate('user', [
                'username'
            ])
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' })
        }
    },
    addPost: async (req, res) => {
        const { title, description, url, status } = req.body

        // Simple validation
        if (!title)
            return res
                .status(400)
                .json({ success: false, message: 'Title is required' })

        try {
            const newPost = new Post({
                title,
                description,
                url: url.startsWith('https://') ? url : `https://${url}`,
                status: status || 'TO LEARN',
                user: req.userId
            })

            await newPost.save()

            res.json({ success: true, message: 'Happy learning!', post: newPost })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    },
    updatePost: async (req, res) => {
        const { title, description, url, status } = req.body;

        // Simple validation
        if (!title)
            return res
                .status(400)
                .json({ success: false, message: 'Title is required' })

        try {
            let updatedPost = {
                title,
                description: description || '',
                url: (url.startsWith('https://') ? url : `https://${url}`) || '',
                status: status || 'TO LEARN'
            }

            const postUpdateCondition = { _id: req.body._id, user: req.userId }

            updatedPost = await Post.findOneAndUpdate(
                postUpdateCondition,
                updatedPost,
                { new: true }
            )

            // User not authorised to update post or post not found
            if (!updatedPost)
                return res.status(401).json({
                    success: false,
                    message: 'Post not found or user not authorised'
                })

            res.json({
                success: true,
                message: 'Excellent progress!',
                post: updatedPost
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    },
    deletePost: async (req, res) => {
        try {
            const postDeleteCondition = { _id: req.params.id, user: req.userId }
            const deletedPost = await Post.findOneAndDelete(postDeleteCondition)

            if (!deletedPost)
                return res.status(401).json({
                    success: false,
                    message: 'Post not found or user not authorised'
                })

            res.json({ success: true, post: deletedPost })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

}
module.exports = postController;