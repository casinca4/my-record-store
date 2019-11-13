const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');          
const db = low(adapter);


exports.getOrders = (req, res, next) => {       //exports is object
    const orders = db.get('orders').value();
    res.status(200).send(orders);
  };
  
  exports.addOrder = (req, res, next) => {
    const order = req.body;                        //body: die Daten, die wir in postman in body eingegeben haben; record ist willkürlich gewählt, nicht wg. postman
    db.get('orders')
      .push(order)
      .last()
      .assign({ id: Date.now().toString() })
      .write();
  
    res.status(200).send(order);
  };

  
  exports.getOrder = (req, res, next) => {
    const { id } = req.params;
    const order = db
      .get('orders')
      .find({ id })
      .value();
  
    res.status(200).send(order);
  };
  
  exports.deleteOrder = (req, res, next) => {
    const { id } = req.params;
    const order = db
      .get('orders')
      .remove({ id })
      .write();
  
    res.status(200).send(order);
  };
  
  exports.updateOrder = (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
  
    const order = db
      .get('orders')
      .find({ id })
      .assign(data)
      .write();
  
    res.status(200).send(order);
  };

  // console.log(exports);     //{ getOrders: [Function], addOrder: [Function] }

  