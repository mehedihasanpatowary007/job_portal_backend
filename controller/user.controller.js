import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadImage } from "../utilis/uploadImage.js";
import uploadPDF from "../utilis/uploadPdf.js";

export const register = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, password, role, profilePhoto } =
      req.body;
    if (
      !fullName ||
      !phoneNumber ||
      !email ||
      !password ||
      !profilePhoto ||
      !role
    ) {
      res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({
        message: "User already exist with this email",
        success: false,
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const imageRes = await uploadImage(profilePhoto);
    await User.create({
      fullName,
      phoneNumber,
      email,
      password: hashPassword,
      role,
      profile: {
        profilePhoto: imageRes,
      },
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    const findUser = await User.findOne({ email });
    if (!findUser) {
      res.status(400).json({
        message: "Incorrect Email Or Password",
        success: false,
      });
    }
    const isPassword = await bcrypt.compare(password, findUser.password);
    if (!isPassword) {
      res.status(400).json({
        message: "Incorrect Password",
        success: false,
      });
    }

    //check role correct or not
    if (role !== findUser.role) {
      res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    const tokenData = {
      userId: findUser._id,
    };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    const user = {
      userId: findUser._id,
      fullName: findUser.fullName,
      phoneNumber: findUser.phoneNumber,
      email: findUser.email,
      role: findUser.role,
      profile: findUser.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: `Welcome back ${findUser.fullName}`,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAeg: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const profileUpdate = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills, resume, profilePhoto } =
      req.body;

    let skillArr;
    if (skills) {
      skillArr = Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim());
    }
    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (email) user.email = email;
    if (bio) user.profile.bio = bio;
    if (profilePhoto) {
      const resImage = await uploadImage(profilePhoto);
      user.profile.profilePhoto = resImage;
    }
    if (resume) {
      try {
        const resPdf = await uploadPDF(resume, user._id);
        console.log(resPdf);
        user.profile.resume = resPdf;
      } catch (error) {
        console.log(error.message);
      }
    }
    if (skills) user.profile.skills = skillArr;

    await user.save();

    user = {
      userId: user._id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };
    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
