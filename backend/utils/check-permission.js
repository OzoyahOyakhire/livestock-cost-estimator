import { UnauthenticatedError, UnauthorizedError } from "../errors/index.js";

//checking user role
const checkPermission = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.id === resourceUserId.toString()) return;
  throw new UnauthorizedError("You don't have the permission");
};

export default checkPermission;
