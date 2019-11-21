//den Ordner haben wir hinzugefügt

// exports.getRecords = (req, res, next) => {
//     res.status(200).send( {alltherecords: 'lalala'});
// };

/////////////////

const Record = require('../models/Record');
const createError = require('http-errors');

exports.getRecords = async (req, res, next) => {
  // try {
  //   const records = await Record.find();
  //   res.status(200).send(records);
  // } catch (e) {
  //   next(e);
  // }
};

exports.addRecord = async (req, res, next) => {
  // const record = req.body;                        //body: die Daten, die wir in postman in body eingegeben haben; record ist willkürlich gewählt, nicht wg. postman
  // try {
  //   const record = new Record(req.body);     //req.body entspricht data
  //   await record.save();
  //   res.status(200).send(record);
  // } catch (e) {
  //   next();
  // }
};

exports.getRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await Record.findById(id);   //in db gucken
    if (!record) throw new createError.NotFound();
    res.status(200).send(record);
  } catch (e) {
    next();
  }
  };

  exports.deleteRecord = async (req, res, next) => {
    try {
      const record = await Record.findByIdAndDelete(req.params.id);
      if (!record) throw new createError.NotFound();
      res.status(200).send(record);
    } catch (e) {
      next(e);
    }
  };

  exports.updateRecord = async (req, res, next) => {
    try {
      const record = await Record.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      });
      if (!record) throw new createError.NotFound();
      res.status(200).send(record);
    } catch (e) {
      next(e);
    }
  };