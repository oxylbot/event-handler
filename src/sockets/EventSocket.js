const EventEmitter = require("events");
const zmq = require("zeromq");

class EventSocket extends EventEmitter {
	constructor() {
		super();
		this.socket = zmq.socket("pull");
		this.socket.on("message", this.message.bind(this));

		this.proto = null;
	}

	start(proto) {
		this.proto = proto;
		this.socket.connect(`tcp://event-handler-zmq-proxy:${process.env.EVENT_HANDLER_ZMQ_PROXY_SERVICE_PORT_PUSH}`);
	}

	message(message) {
		// TODO
		// this.emit("message", this.proto.lookup("Command").decode(message));
	}

	close() {
		this.socket.close();
	}
}

module.exports = EventSocket;
