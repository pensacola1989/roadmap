
let resHashMap = new Map();

export class Poll {


	constructor(options, services, app, socketIO) {
		this.options = options;
	}

	index (req, res, next) {
		let key = req.query.key;
		let jsonpCb = req.query.callback;

		resHashMap.set(key, {
			resp: res,
			jsonp: jsonpCb
		})
		// resHashMap.set(key, res);
		return;
	};

	notify (req, res, next) {
		let notifyKey = req.query.notify_key;
		let targetRes = resHashMap.has(notifyKey) ? resHashMap.get(notifyKey) : undefined;
		if (targetRes != undefined && targetRes.resp.writable) {
			var ret = JSON.stringify({ scaned: 1 });
			targetRes.resp.write(`${targetRes.jsonp}(${ret})`);
			targetRes.resp.end();
			resHashMap.delete(notifyKey);
		}
		return res.end();
	}
}
