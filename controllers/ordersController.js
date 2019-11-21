const Order = require('../models/Order');
const createError = require('http-errors');


exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).send(orders);
  } catch (e) {
    next(e);
  }
};

exports.addOrder = async (req, res, next) => {
  const order = req.body;
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(200).send(order);
  } catch (e) {
    next();
  }
};


exports.getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) throw new createError.NotFound();
    res.status(200).send(order);
  } catch (e) {
    next();
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) throw new createError.NotFound();
    res.status(200).send(order);
  } catch (e) {
    next(e);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true                                       //2.: was wir updaten möchten
    });
    if (!order) throw new createError.NotFound();
    res.status(200).send(order);
  } catch (e) {
    next(e);
  }
};

  // console.log(exports);     //{ getOrders: [Function], addOrder: [Function] }

