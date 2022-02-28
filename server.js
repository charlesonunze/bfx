'use strict';

const { PeerRPCServer } = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');
const { getOrders, updateDB } = require('./db');
const findMatch = require('./match');
const { orderType, orderBook, Order } = require('./orderBook');

const link = new Link({
	grape: 'http://127.0.0.1:30002'
});
link.start();

const peer = new PeerRPCServer(link, {});
peer.init();

const service = peer.transport('server');
service.listen(1337);

setInterval(() => {
	link.announce('trade', service.port, {});
}, 1000);

service.on('request', (rid, key, payload, handler) => {
	const { type, order, orderBook } = payload;

	handleRequests(type, order, handler.reply);
});

function handleRequests(type, order, reply) {
	switch (type) {
		case 'create_order':
			order.side === orderType.BUY
				? orderBook.addBuyOrder(order)
				: orderBook.addSellOrder(order);
			let match = findMatch(order);
			let remainder = order.amount - match.amount;

			if (remainder > 0) {
				let ord = new Order({
					...order,
					amount: remainder
				});

				updateDB(order);
				return reply(null, { ord, orders: getOrders() });
			}

			if (match.foundIndex.length < 1) {
				console.log('no match found');
			}

			// update db and announce the new order to other instances
			updateDB(order);
			reply(null, { order, orders: getOrders() });

			break;

		case 'remove_order':
			// announce the new order to other instances
			reply(null, { order });
			break;
	}
}
