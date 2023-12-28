import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import post from "../models/post.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const updateUserController = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    if (password && password.length < 6)
      return res
        .status(200)
        .json({ msg: "Password must be at least 6 characters long" });

    if (!password)
      return res.status(400).json({ msg: "Please enter your password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const compare = comparePassword(password, user.password);
    let passChange = false;
    let nameChange = false;

    if (name !== user.name) nameChange = true;
    if (!compare) passChange = true;

    const hashed = await hashPassword(password);
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { name: name || user.name, password: hashed || user.password },
      { new: true }
    );

    updatedUser.password = undefined;
    return res.status(200).json({ msg: "Updated", user: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const userPostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description)
      return res.status(500).send({ msg: "Please fill all the fields" });

    // console.log(req.headers.authorization); we can get token from here also but for this we have follow the same procedure which we have already done in middleware so it will be good to set the user to req so that we can get the id

    const newPost = await post.create({
      title,
      description,
      postedBy: req.user._id,
    });

    console.log(newPost);

    return res
      .status(201)
      .json({ msg: "Hurray! You Posted Something", post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getAllPostController = async (req, res) => {
  const allPosts = await post
    .find()
    .populate("postedBy", "name")
    .sort("-createdAt");
  console.log(allPosts);
  return res.status(200).json({ allPosts });
};

export const getPostByUser = async (req, res) => {
  const posts = await post
    .find({ postedBy: req.user._id })
    .populate("postedBy", "name")
    .sort("-createdAt");
  return res.status(200).json({ posts });
};

//  middleware for token

export const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    await post.findByIdAndDelete({ _id: id });
    return res.status(200).json({ msg: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const updatePostController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const { title, description } = req.body;
    if (!title || !description)
      return res.status(400).json({ msg: "Please fill all the fields" });
    const updatedPost = await post.findOneAndUpdate(
      { _id: id },
      { title, description },
      { new: true }
    );
    console.log(updatedPost);

    return res.status(200).json({ msg: "Post updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const authMiddleware = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) return res.status(401).json({ msg: "Invalid Authentication" });

  token = token.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ msg: "Invalid Authentication" });

    req.user = user;
    next();
  });
};
