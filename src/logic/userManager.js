class UserManager {
  constructor(userRepository, userStore) {
    this._userRepository = userRepository;
    this._userStore = userStore;
  }

  get UserRepository() {
    return this._userRepository;
  }
  get UserStore() {
    return this._userStore;
  }
  async createUser(user) {
    return user;
  }
}
export default UserManager;
