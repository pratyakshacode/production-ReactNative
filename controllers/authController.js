import User from "../models/user.js";
import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ msg: "Missing register fields", success: false });

    const user = await User.findOne({ email });
    res.cookie("token", "test", { httpOnly: true });

    if (user)
      return res
        .status(400)
        .json({ msg: "Email already exists", success: false });

    const pass = await hashPassword(password);

    const newUser = new User({ name, email, password: pass });
    await newUser.save();

    return res.status(200).json({ msg: "Register success", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Internal server error", success: false });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ msg: "Missing login fields", success: false });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "User not found", success: false });

    const match = await comparePassword(password, user.password);
    if (!match)
      return res
        .status(400)
        .json({ msg: "Invalid Credentials", success: false });

    user.password = undefined;

    const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ msg: "Login success", success: true, token, user });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ msg: "Internal server error", success: false });
  }
};
