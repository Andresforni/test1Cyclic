class TelegramBot {
	constructor(token, callback) {
		this.token = token;
		this.baseUrl = 'https://api.telegram.org/bot' + token + '/';
		this.interval = null;
		this.messages = [];
		this.callback = callback;
		this.lastUpdate = 0;
		this.https = require('https');
	}
	start() {
		this.interval = setInterval(() => this.getUpdates.call(this), 2000);
	}
	stop() {
		clearInterval(this.interval);
	}
	getUpdates() {
		this.https.get(this.baseUrl + 'getUpdates?offset=' + this.lastUpdate, (res) => {
			let content = '';
			res.on('data', (chunk) => content += chunk);
			res.on('end', () => {
				try {
					const updates = JSON.parse(content).result || [];
					updates.forEach(update => {
						if (this.lastUpdate <= update.update_id) this.lastUpdate = update.update_id + 1;
						const id = update.message.chat.id;
						const text = update.message.text;
						const action = text.split(' ')[0].split('@')[0];

						const response = this.callback({
							action: action,
							text: text,
							chat_id: id,
							message: update.message
						});
						if (response != null) this.send({
							chat_id: id,
							text: response
						});

					});

				} catch (error) {
					console.error(error.message);
				};
			});
		}).on('error', (error) => console.error(error.message));
	}
	encode(obj) {
		let result = [];
		for (let prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				result.push(encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]));
			}
		}

		return result.join('&');
	}
	send(message) {
		try {
			this.https.get(this.baseUrl + 'sendMessage?' + this.encode(message));
		} catch (error) {
			console.error(error.message);
			setTimeout(() => this.send.call(this, message), 1000);
		}
	}
}

module.exports = TelegramBot;
