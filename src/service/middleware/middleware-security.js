import passport from 'passport';

export function authenticated () {
  return passport.authenticate('jwt', { session: false });
}