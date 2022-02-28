'use strict';

const { orderType } = require("./orderBook");

let db = {
	buyOrders: [],
	sellOrders: []
};

function getOrders() {
	return db;
}

function addBuyOrder(order) {
	db.buyOrders.push(order);
}

function addSellOrder(order) {
	db.sellOrders.push(order);
}

function removeBuyOrder(key) {
	delete db[key];
}

function removeSellOrder(key) {
	delete db[key];
}

function updateDB(order) {
	order.side === orderType.BUY ? addBuyOrder(order) : addSellOrder(order);
}

module.exports = {
	getOrders,
	addBuyOrder,
	addSellOrder,
	removeBuyOrder,
	removeSellOrder,
	updateDB
};
