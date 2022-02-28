const { getOrders } = require('./db');
const { orderType } = require('./orderBook');

const findMatch = (order, remainder = 0, foundIndex = [], first = true) => {
	let currentAmount = first ? order.amount : remainder;
	let unresolvedAmount = order.amount;

	const orders =
		order.side === orderType.BUY
			? getOrders().sellOrders.map((o) => o.amount)
			: getOrders().buyOrders.map((o) => o.amount);

	const index = orders.findIndex((x) => x === currentAmount);

	if (index > -1) {
		const value = orders[index];
		currentAmount = order.amount - value;
		unresolvedAmount = currentAmount;
		foundIndex.push(index);
		remainder = unresolvedAmount;
	} else {
		remainder = currentAmount - 1;
	}

	if (currentAmount <= 0) {
		return {
			foundIndex,
			remainder,
			orderId: order.id,
			match:
				order.side === orderType.BUY
					? getOrders().sellOrders[foundIndex]
					: getOrders().buyOrders[foundIndex]
		};
	}

	return findMatch(
		{ ...order, amount: unresolvedAmount },
		remainder,
		foundIndex,
		false
	);
};

module.exports = findMatch;
