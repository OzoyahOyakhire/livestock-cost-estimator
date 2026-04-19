import { StatusCodes } from "http-status-codes";
import User from "../models/user.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors/index.js";
import {
  attachCookiesToResponse,
  createHash,
  createUserToken,
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "../utils/index.js";
import crypto from "crypto";
import Token from "../models/token.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//registering user
const register = async (req, res, next) => {
  const payload = req.body;

  try {
    const isExisting = await User.findOne({ email: payload.email });
    if (isExisting) {
      return next(new ConflictError("Email already exists"));
    }

    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? "admin" : "user";

    const verificationToken = crypto.randomBytes(40).toString("hex");

    const newUser = await User.create({
      ...payload,
      role,
      verificationToken,
      isVerified: false,
    });

    const verificationLink = `${process.env.API_URL}/api/v1/auth/verify-email?token=${verificationToken}&email=${newUser.email}`;

    try {
      await sendVerificationEmail({
        name: newUser.name,
        email: newUser.email,
        verificationLink,
      });
    } catch (emailError) {
      await User.findByIdAndDelete(newUser._id);
      throw new BadRequestError(emailError.message ||"Unable to send verification email");
    }

    return res.status(StatusCodes.CREATED).json({
      msg: "Success! Please check your email to verify account",
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  const { token, email } = req.query;

  if (!token || !email) {
    throw new BadRequestError("Invalid verification link");
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new UnauthenticatedError("Verification failed");
    }

    if (user.verificationToken !== token) {
      throw new UnauthenticatedError("Verification failed");
    }

    user.isVerified = true;
    user.verified = new Date();
    user.verificationToken = null;

    await user.save();

    return res.status(StatusCodes.OK).json({
      msg: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //checking existing user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      const err = new UnauthenticatedError(
        "Email does not exist, try correct email or create account",
      );
      return next(err);
    }
    //comparing passwords
    const checkCredentials = await user.comparePassword(password);
    if (!checkCredentials) {
      const err = new UnauthenticatedError("Incorrect Credentials");
      return next(err);
    }

    if (!user.isVerified) {
      const err = new UnauthenticatedError("Please verify your email");
      return next(err);
    }

    const tokenUser = createUserToken(user);
    //creating token
    let refreshToken = "";

    const existingToken = await Token.findOne({ user: user._id });
    if (existingToken) {
      const { isValid } = existingToken;
      if (!isValid) {
        throw new UnauthenticatedError("Invalid Credentials");
      }
      refreshToken = existingToken.refreshToken;
      attachCookiesToResponse({ res, user: tokenUser, refreshToken });

      res
        .status(StatusCodes.ACCEPTED)
        .json({ msg: ` welcome onboard ${user.name} ` });
      return;
    }

    //checking for existing Token
    refreshToken = crypto.randomBytes(40).toString("hex");
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const userToken = { refreshToken, ip, userAgent, user: user._id };

    await Token.create(userToken);
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    return res
      .status(StatusCodes.ACCEPTED)
      .json({ msg: ` welcome onboard ${user.name} ` });
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    throw new UnauthenticatedError("Google Token is required");
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new UnauthenticatedError("Invalid Google token");
    }

    const { email, name, picture, email_verified } = payload;

    if (!email_verified) {
      throw new UnauthenticatedError("Google email is not verified");
    }

    let user = await User.findOne({ email });
    if (!user) {
      const isFirstAccount = (await User.countDocuments({})) === 0;
      const role = isFirstAccount ? "admin" : "user";

      user = await User.create({
        name,
        email,
        role,
        password: crypto.randomBytes(20).toString("hex"),
        isVerified: true,
        verified: new Date(),
      });
    }

    const tokenUser = createUserToken(user);

    let refreshToken = "";
    const existingToken = await Token.findOne({ user: user._id });

    if (existingToken) {
      refreshToken = existingToken.refreshToken;
      attachCookiesToResponse({ res, user: tokenUser, refreshToken });

      return res.status(StatusCodes.OK).json({
        msg: "Google login successful",
        user: tokenUser,
      });
    }

    refreshToken = crypto.randomBytes(40).toString("hex");

    const userAgent = req.headers["user-agent"];
    const ip = req.ip;

    await Token.create({
      refreshToken,
      ip,
      userAgent,
      user: user._id,
    });

    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    return res.status(StatusCodes.OK).json({
      msg: "Google login successful",
      user: tokenUser,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  await Token.findOneAndDelete({ user: req.user.id });

  res.cookie("accessToken", "logout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.cookie("refreshToken", "logout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(StatusCodes.OK).json({ msg: "user log out" });
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide a valid email");
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      const passwordToken = crypto.randomBytes(70).toString("hex");
      //send email
      const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password?token=${passwordToken}&email=${user.email}`;
      await sendResetPasswordEmail({
        name: user.name,
        email: user.email,
        resetPasswordLink,
      });

      const tenMinutes = 1000 * 60 * 10;
      const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

      user.passwordToken = createHash(passwordToken);
      user.passwordTokenExpirationDate = passwordTokenExpirationDate;
      await user.save();
    }
    res
      .status(StatusCodes.OK)
      .json({ msg: "Please check your email for reset password link" });
  } catch (error) {
    next(error);
  }
};
const resetPassword = async (req, res, next) => {
  const { newPassword, email, token } = req.body;

  if (!email || !newPassword || !token) {
    throw new BadRequestError("Please provide email, token and new password");
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid or expired reset link" });
    }

    const hasExpired = new Date() > user.passwordTokenExpirationDate;
    const checkToken = user.passwordToken === createHash(token);

    if (!checkToken || hasExpired) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid or expired reset link" });
    }

    user.password = newPassword;
    user.passwordToken = null;
    user.passwordTokenExpirationDate = null;
    await user.save();

    return res.status(StatusCodes.OK).json({
      msg: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

export {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  googleLogin,
};
