class Order {
	constructor({ id, amount, side, createdBy }) {
		this.id = id;
		this.amount = amount;
		this.side = side;
		this.createdBy = createdBy;
		this.createdAt = Date.now();
	}
}

class OrderBook {
	constructor() {
		if (OrderBook.instance == null) {
			this.buyOrders = [];
			this.sellOrders = [];
			OrderBook.instance = this;
		}

		return OrderBook.instance;
	}

	syncOrders({ buyOrders, sellOrders }) {
		this.buyOrders = buyOrders;
		this.sellOrders = sellOrders;
	}

	getOrders() {
		return {
			buyOrders: this.buyOrders,
			sellOrders: this.sellOrders
		};
	}

	addBuyOrder(order) {
		this.buyOrders.push(order);
	}

	addSellOrder(order) {
		this.sellOrders.push(order);
	}

	removeBuyOrder(key) {}

	removeSellOrder(key) {}
}

const orderType = {
	BUY: 'buy',
	SELL: 'sell'
};

const orderBook = new OrderBook();
// Object.freeze(orderBook);

module.exports = { Order, orderBook, orderType };
