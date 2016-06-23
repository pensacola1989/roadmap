import OAuth from 'wechat-oauth';

export class Test {

	constructor(options, services, app, socketIO) {
		this.options = options;
		this.testService = services.TestService;
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
	code (req, res, next) {
		res.write(req.query.code);
		res.end();
	};
	index (req, res, next) {
		let client = new OAuth('wx236de42b1edcd623', '8d6c2cd8e8c3db33bc51541e1f31e09d');
		let url = client.getAuthorizeURL('http://localhost/code', '1', 'snsapi_userinfo');
		console.log(url);
				// sdfsdf23423_
		let openId = req.params.openid || 'sdfsdf23423_';
		this.testService
			.getUserByOpenId(openId)
			.then((user) => {
				return res.render('index', { user: user, openId: openId });
			})
			.catch((err) => {
				next(err.message);
			})
			.finally(() => {
				console.log('user query finished');
			})
		// return res.render('index');
	};
	saveUser (req, res, next) {
		var user = {
			userName: req.body.username,
			mobile: req.body.mobile,
			company: req.body.company,
			duty: req.body.duty,
			openid: req.params.openid
		}
		console.log(req.body)
		this.testService
			.saveUser(user)
			.then((ret) => {
				res.json(ret);
				res.end();
			})
			.catch((err) => {
				res.status(500).send(err);
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
