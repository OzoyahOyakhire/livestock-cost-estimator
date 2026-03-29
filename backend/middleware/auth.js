import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError, UnauthorizedError } from "../errors/index.js";
import { attachCookiesToResponse, isTokenValid } from "../utils/jwt.js";
import Token from "../models/token.js";

//user authentication
const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }
    const payload = isTokenValid(refreshToken);
    const existingToken = await Token.findOne({
      user: payload.user.id,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError("Authentication Invalid");
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    req.user = payload.user;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authenticated Failed");
  }
};

//user permission
const authorizePermission = (...roles) => {
  return async (req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
      throw new UnauthorizedError("unauthorized to access this route");
    }
    next();
  };
};

export { authenticateUser, authorizePermission };
