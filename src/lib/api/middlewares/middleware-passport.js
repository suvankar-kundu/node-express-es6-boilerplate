import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";

export default function middlewarePassportJWT(
  app,
  issuer,
  secretOrKey,
  getUserDetails
) {
  passport.use(
    new JWTStrategy(
      {
        secretOrKey,
        issuer,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
      },
      async (token, done) => {
        try {
          const user = await getUserDetails(token.sub.toLowerCase().trim());
          if (user && user.isActive === true) {
            done(null, user);
          } else {
            done("User not active/registered", false);
          }
        } catch (err0r) {
          done(err, false);
        }
      }
    )
  );
  app.use(passport.initialize());
}
