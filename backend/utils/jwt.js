import jwt from "jsonwebtoken";
const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
  return token;
};

const isTokenValid = (token) => {
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  return verify;
};

//storing token in cookie
const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJwt = createJWT({ payload: { user } });
  const refreshTokenJwt = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessTokenJwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });
  res.cookie("refreshToken", refreshTokenJwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + longerExp),
  });
};

export { createJWT, isTokenValid, attachCookiesToResponse };
