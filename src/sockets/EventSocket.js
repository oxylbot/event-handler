const EventEmitter = require("events");
const { Pull } = require("zeromq");

class EventSocket extends EventEmitter {
	constructor() {
		super();
		this.socket = new Pull();
		this.messageHandler();

		this.proto = null;
	}

	start(proto) {
		this.proto = proto;
		this.socket.connect(`tcp://event-handler-zmq-proxy:${process.env.EVENT_HANDLER_ZMQ_PROXY_SERVICE_PORT_PUSH}`);
	}

	async messageHandler() {
		while(!this.socket.closed) {
			const [message] = await this.socket.receive();

			this.emit("message", message);
		}
	}

	close() {
		this.socket.close();
	}
}

module.exports = EventSocket;
