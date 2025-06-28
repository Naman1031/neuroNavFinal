import bcrypt from "bcryptjs";
import { User } from "../models/user.models.js";
import generateAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Please fill in all the fields!" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ error: "User already exists in the database!" });
    }

    // password hashing
    const namak = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, namak);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateAndSetCookie(newUser._id, res);

      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      });
    } else {
      return res
        .status(400)
        .json({ error: "Something went wrong while creating the new user!" });
    }
  } catch (error) {
    console.log("Error in signup controller!", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect)
      return res.status(400).json({ error: "Incorrect emailId or password!" });

    generateAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (error) {
    console.log("Error in the login controller!", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in the logout controller!", error.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const sendSurveyData = async (req, res) => {
  try {
    const { surveyData } = req.body;
    console.log(surveyData);
    const userId = req.userID;

    const user = await User.findByIdAndUpdate(
      userId,
      { surveyData: surveyData },
      { new: true }
    );
    console.log(user);

    res.status(200).json({ message: "Successful" });
  } catch (error) {
    console.log("Error in the survey data controller!", error.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const getSurveyData = async (req, res) => {
  try {
    const userId = req.userID;
    const user = await User.findById(userId);
    res.status(200).json({ surveyData: user?.surveyData || [] });
  } catch (error) {
    console.error("Error fetching survey data", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
