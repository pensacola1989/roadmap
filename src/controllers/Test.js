
export class Test {

	constructor(options, services, app, socketIO) {
		this.options = options;
		this.testService = services.TestService;
		this.fuck = 'you';
	}

	action (req, res, next) {
		res.write(this.testService.foo());
		res.end();
	};
}
