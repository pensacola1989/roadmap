
let resHashMap = new Map();

export class Poll {


	constructor(options, services, app, socketIO) {
		this.options = options;
	}

	index (req, res, next) {
		let key = req.query.key;
		let jsonpCb = req.query.callback;
		if (key.indexOf('$$') > -1) {
			key = key.split('$$').shift();
			console.log(key);
		}
		resHashMap.set(key, {
			resp: res,
			jsonp: jsonpCb
		})
		// resHashMap.set(key, res);
		return;
	}

	notify (req, res, next) {
		let token = req.query.token || '';
		let uid = req.query.uid || '';
		let notifyKey = req.query.notify_key;
		let name = req.query.name || '';
		if (notifyKey.indexOf('$$') > -1) {
			notifyKey = notifyKey.split('$$').shift();
		}
		let targetRes = resHashMap.has(notifyKey) ? resHashMap.get(notifyKey) : undefined;
		if (targetRes != undefined && targetRes.resp.writable) {
			var ret = JSON.stringify({ scaned: 1, uid: uid, token: token, name: name });
			targetRes.resp.write(`${targetRes.jsonp}(${ret})`);
			targetRes.resp.end();
			resHashMap.delete(notifyKey);
		}
		return res.write(1);
	}
}
