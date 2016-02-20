
let resHashMap = new Map();

export class Poll {


	constructor(options, services, app, socketIO) {
		this.options = options;
	}

	index (req, res, next) {
		var key = req.query.key;
		resHashMap.set(key, res);
		return;
	};

	notify (req, res, next) {
		var notifyKey = req.query.notify_key;
		var targetRes = resHashMap.has(notifyKey) ? resHashMap.get(notifyKey) : undefined;
		if (targetRes != undefined && targetRes.writable) {
			targetRes.write({ scaned: 1 });
			targetRes.end();
			resHashMap.delete(targetRes);
		}
		return ;
	}
}
