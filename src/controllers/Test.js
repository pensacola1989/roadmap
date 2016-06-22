
export class Test {

	constructor(options, services, app, socketIO) {
		this.options = options;
		this.testService = services.TestService;
		this.fuck = 'you';
	}

	action (req, res, next) {
		this.testService
			.foo()
			.then((user) => {
				res.json(user);
				res.end();
			})
		// res.write(this.testService.foo());
		// res.end();
	};
	index (req, res, next) {
		return res.render('index');
	};
	saveUser (req, res, next) {
		var user = {
			userName: 'www',
			mobile: '15989898989',
			company: 'MS',
			duty: 'CEO',
			openid: 'sdfsdf23423_'
		}
		this.testService
			.saveUser(user)
			.then((ret) => {
				res.json(ret);
				res.end();
			})
			.catch((err) => {
				res.json(err);
				res.end();
				// next(err);			
			})
			.finally((err) => {
				console.log('...save user finished...');
			});
	};

	getOpenId (req, res, next) {
		let openId = req.params.openid;
		this.testService
			.getUserByOpenId(openId)
			.then((user) => {
				res.json(user);
				res.end();
			})
			.catch((err) => {
				console.error(err);
				next(err);
			})
			.finally(() => {
				console.log('...get user by openId finished....');
			})
	}
}
