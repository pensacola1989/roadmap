import User from '../models/user.js'

export class TestService {

	constructor(options) {
		this.options = options;
	}

	getAllUsers() {
		return User.fetchAll();
	}
	/**
	* save a user
	* @param user user object
	*/
	saveUser(user) {
		return new User(user).save();
	}

	foo() {
		return User.fetchAll();
		// return 'foo from services';
	}
}
