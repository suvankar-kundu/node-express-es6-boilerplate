import passport from "passport";
import { isNullOrUndefined } from "../../../common/lib/utilities";

export function middlewareIsUserAuthenticated() {
  return passport.authenticate("jwt", { session: false });
}

export function middlewareUserHasRole(role, securityManager) {
  return async function (req, res, next) {
    if (!isNullOrUndefined(req, user)) {
      try {
        const userHasRole = await securityManager.userHasRole(req.user, role);
        if (userHasRole === true) {
          next();
        } else {
          res.status(403).send("You are not allowed to perform this operation");
        }
      } catch (error) {
        res.status(500).send(error.message);
      }
    } else {
      res.status(404).send("Unauthorized");
    }
  };
}
