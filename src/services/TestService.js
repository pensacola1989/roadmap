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

	getUserByOpenId (openId) {
		return User.where('openid', '=', openId).fetch();
	}
	getUserByMobile (mobile) {
		return User.where('mobile', '=', mobile).fetch();
	}
	foo() {
		return User.fetchAll();
		// return 'foo from services';
	}
}
