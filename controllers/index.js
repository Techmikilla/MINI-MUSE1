
const User = require("../model/user.model");
const Blog = require("../model/blog.model");

async function fetchUsers (req, res) {
    try {
        let users = await User.find();
        res.status(200).json ({message: "users fetched", users});
    } catch (error) {
        res.status(500).json({message: "server error"});
    }
};

async function createUser (req, res) {
    try {
        let userExists = await User.findOne({email: req.body.email});
        if(userExists) {
            res.status(400).json ({
                message: "user already exists, please log in" 
            });
        } else {
            let user = new User(req.body);
        await user.save();
        res.status(201).json({message:"user created successfully", user});
        }
    } catch (error) {
        res.status(500).json ({message: "server error"});
    }
};

async function deleteUser (req, res) {

    try {
        let userExists = await User.findOne({email: req.body.email});
        if(userExists) {
            await User.deleteOne({email: req.body.email})
            res.status(200).json ({
                message: "user deleted successfully" 
            });
        } else {
        res.status(400).json({message:"user does mot exist"});
        }
    } catch (error) {
        res.status(500).json ({message: "server error"});
    }
};

async function updateUser (req, res) {

    try {
        let userExists = await User.findById(req.params.id);
        if(userExists) {
            let updateduser = await userExists.updateOne(req.body);
            res.status(201).json ({
                message: "your account has been updated successully", userExists, updateduser
            });
        } else {
        res.status(404).json({message:"user does not exist"});
        }
    } catch (error) {
        res.status(500).json ({message: "server error"});
    };
};

async function getBase (req, res) {
    try {
        res.status(200).json ({message: "Hi user"});
    } catch (error) {
        res.status(400).json({message:"server error"});
    }
};

async function fetchUsers (req, res) {
    try {
        let users = await User.find();
        res.status(200).json ({message: "users fetched", users});
    } catch (error) {
        res.status(500).json({message: "server error"});
    }
};

async function createBlog(req, res) {
    try {
            let blog = new Blog(req.body);
            await blog.save();
            res.status(201).json({
                message: "blog created", blog
            });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "server error"
        });
    }
}

async function fetchAllBlogs(req, res) {
    try {
        let blogs = await Blog.find()
        res.status(200).json({message: "blogs fetched", blogs});
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "server error"
        });
    }
}

async function fetchBlogById(req, res) {
    try {
        let blog = await Blog.findById(req.params.id)
        res.status(200).json({
            message: "blog fetched by id", blog
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "server error"
        });
    }
}

async function updateBlog(req, res) {
    try {
        let blogExists = await Blog.findById(req.params.id);
        if (blogExists) {
            await blogExists.updateOne(req.body);
            res.status(201).json({
                message: "blog updated",
                blogExists
            });
        } else {
            res.status(404).json({
                message: "blog does not exist",
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "server error"
        });
    }
}

async function deleteBlog (req, res) {
    try {
        let blogExists = await Blog.findById(req.params.id);
        if (blogExists) {
            await blogExists.deleteOne(req.body);
            res.status(201).json({
                message: "blog deleted",
                blogExists
            });
        } else {
            res.status(404).json({
                message: "blog does not exist",
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "server error"
        });
    }
}

async function unknownRoute (req, res) {
    try {
        res.status(404).json({message: "page not found"});
    } catch (error) {
        res.status(500).json({message: "server error"});
    }
};




module.exports = { unknownRoute, getBase, createUser, fetchUsers, deleteUser, updateUser, createBlog, fetchAllBlogs, fetchBlogById, updateBlog, deleteBlog};