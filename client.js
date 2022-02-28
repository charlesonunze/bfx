'use strict';

const { PeerRPCClient } = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');
const uuid = require('uuid').v4;

const { getOrders } = require('./db');
const { orderBook, orderPairs, orderType, Order } = require('./orderBook');

const link = new Link({
	grape: 'http://127.0.0.1:30002',
	requestTimeout: 10000
});
link.start();

const peer = new PeerRPCClient(link, {});
peer.init();

const order = new Order({
	id: uuid(),
	amount: 30,
	side: orderType.BUY,
	createdBy: uuid()
});

console.log('db1:::', orderBook.getOrders());

const payload = { type: 'create_order', order, orderBook };

peer.map('trade', payload, { timeout: 10000 }, (err, result) => {
	const { order, orders } = result[0];

	const { buyOrders, sellOrders } = orders;
	orderBook.syncOrders({ buyOrders, sellOrders });

	const found1 = buyOrders.find((_order) => order.id === _order.id);
	const found2 = sellOrders.find((_order) => order.id === _order.id);

	console.log('db2:::', orderBook.getOrders());

	if (found1 || found2) return;

	updateOrderBook(order);

	console.log('db2:::', orderBook.getOrders());
});

function updateOrderBook(order) {
	console.log('update called');
	order.side === orderType.BUY
		? orderBook.addBuyOrder(order)
		: orderBook.addSellOrder(order);
}

const peerClient = peer;
module.exports = peerClient;
