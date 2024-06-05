
function applyDiscount(total, userId, guestUserId) {
    if (userId !== guestUserId) {
        total *= 0.10;
    }
    return { total };
}

export { applyDiscount };

/*function applySecretDiscount(order) {
    const secretID = Math.floor(Math.random() * 10);
    console.log(`Generated Secret ID: ${secretID}`);

    if (order.orderNumber === secretID) {
        const discount = order.total * 0.35;
        order.total -= discount;
        console.log(`Discount applied: ${discount}, New Total: ${order.total}`);
    } else {
        console.log("No discount applied.");
    }

    return order;
}
export { applySecretDiscount }

const VIP_USER_IDS = [1234, 5678, 9012];

function applyVIPDiscount(order) {
    if (VIP_USER_IDS.includes(order.userId)) {
        console.log(`Congratulations! User ID ${order.userId} is a VIP and the order is free.`);
        order.total = 0;
    } else {
        console.log(`No VIP discount applied for User ID ${order.userId}.`);
    }
    return order;
}
export { applyVIPDiscount }*/