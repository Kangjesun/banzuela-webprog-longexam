const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { HttpStatus } = require("../config/constants");

const publicUser = (user) => {
  const data = user.toObject
    ? user.toObject()
    : { ...user };

  delete data.password;
  data.id = data._id;

  return data;
};

const createToken = (user) =>
  jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET || "your-secret-key",
    {
      expiresIn: "7d",
    }
  );

exports.getUsers = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message:
          "Only administrators can view all users.",
      });
    }

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(HttpStatus.OK).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    ).select("-password");

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(HttpStatus.OK).json({
      success: true,
      data: publicUser(user),
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: "Invalid user ID.",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      contactNumber,
      address,
      role = "customer",
      isActive = true,
    } = req.body;

    const cleanFirstName = firstName?.trim();
    const cleanLastName = lastName?.trim();
    const cleanEmail = email?.toLowerCase().trim();
    const cleanContactNumber =
      contactNumber?.trim();
    const cleanAddress = address?.trim();

    if (
      !cleanFirstName ||
      !cleanLastName ||
      !cleanEmail ||
      !password ||
      !cleanContactNumber ||
      !cleanAddress
    ) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message:
          "First name, last name, email, contact number, address and password are required.",
      });
    }

    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message:
          "Please provide a valid email address.",
      });
    }

    if (!/^09[0-9]{9}$/.test(cleanContactNumber)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message:
          "Please provide a valid Philippine mobile number starting with 09.",
      });
    }

    if (password.length < 8) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message:
          "Password must be at least 8 characters.",
      });
    }

    const exists = await User.findOne({
      email: cleanEmail,
    });

    if (exists) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message:
          "Email address is already in use.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName: cleanFirstName,
      lastName: cleanLastName,
      email: cleanEmail,
      password: hashedPassword,
      contactNumber: cleanContactNumber,
      address: cleanAddress,
      role,
      isActive,
    });

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "User created successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const email = req.body.email
      ?.toLowerCase()
      .trim();

    const password = req.body.password;

    if (!email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: "This account is inactive.",
      });
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    res.status(HttpStatus.OK).json({
      success: true,
      token: createToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    res.status(
      HttpStatus.INTERNAL_SERVER_ERROR
    ).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const authenticatedUserId = req.user?.id;
    const requestedUserId = req.params.id;

    if (
      authenticatedUserId !== requestedUserId &&
      req.user?.role !== "admin"
    ) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message:
          "You are not allowed to update this account.",
      });
    }

    const update = { ...req.body };

    delete update.password;

    if (req.user?.role !== "admin") {
      delete update.role;
      delete update.isActive;
    }

    if (update.email) {
      update.email = update.email
        .toLowerCase()
        .trim();
    }

    if (update.firstName) {
      update.firstName =
        update.firstName.trim();
    }

    if (update.lastName) {
      update.lastName =
        update.lastName.trim();
    }

    if (update.contactNumber) {
      update.contactNumber =
        update.contactNumber.trim();
    }

    if (update.address) {
      update.address =
        update.address.trim();
    }

    if (update.contactNumber) {
      if (
        !/^09[0-9]{9}$/.test(
          update.contactNumber
        )
      ) {
        return res.status(
          HttpStatus.BAD_REQUEST
        ).json({
          success: false,
          message:
            "Please provide a valid Philippine mobile number starting with 09.",
        });
      }
    }

    if (
      update.address !== undefined &&
      !update.address.trim()
    ) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Address cannot be empty.",
      });
    }

    if (update.email) {
      const existingEmail =
        await User.findOne({
          email: update.email,
          _id: { $ne: requestedUserId },
        });

      if (existingEmail) {
        return res.status(
          HttpStatus.BAD_REQUEST
        ).json({
          success: false,
          message:
            "Email address is already in use.",
        });
      }
    }

    const user =
      await User.findByIdAndUpdate(
        requestedUserId,
        update,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: "User updated successfully.",
      data: publicUser(user),
      user: publicUser(user),
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const authenticatedUserId = req.user?.id;
    const requestedUserId = req.params.id;

    if (
      authenticatedUserId !== requestedUserId &&
      req.user?.role !== "admin"
    ) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message:
          "You are not allowed to change this account password.",
      });
    }

    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(
      requestedUserId
    );

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "User not found.",
      });
    }

    const validPassword =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!validPassword) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message:
          "Current password is incorrect.",
      });
    }

    if (
      !newPassword ||
      newPassword.length < 8
    ) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message:
          "New password must be at least 8 characters.",
      });
    }

    user.password =
      await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(HttpStatus.OK).json({
      success: true,
      message:
        "Password changed successfully.",
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (
      req.user?.id !== req.params.id &&
      req.user?.role !== "admin"
    ) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message:
          "You are not allowed to delete this account.",
      });
    }

    const user =
      await User.findByIdAndDelete(
        req.params.id
      );

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    res.status(
      HttpStatus.INTERNAL_SERVER_ERROR
    ).json({
      success: false,
      message: error.message,
    });
  }
};
