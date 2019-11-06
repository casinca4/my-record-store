//den Ordner haben wir hinzugefügt

// exports.getRecords = (req, res, next) => {
//     res.status(200).send( {alltherecords: 'lalala'});
// };

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');          
const db = low(adapter);


exports.getRecords = (req, res, next) => {
    const records = db.get('records').value();
    res.status(200).send(records);
  };
  
  exports.addRecord = (req, res, next) => {
    const record = req.body;                        //body: die Daten, die wir in postman in body eingegeben haben; record ist willkürlich gewählt, nicht wg. postman
    db.get('records')
      .push(record)
      .last()
      .assign({ id: Date.now().toString() })
      .write();
  
    res.status(200).send(record);
  };
  
  exports.getRecord = (req, res, next) => {
    const { id } = req.params;
    const record = db
      .get('records')
      .find({ id })
      .value();
  
    res.status(200).send(record);
  };
  
  exports.deleteRecord = (req, res, next) => {
    const { id } = req.params;
    const record = db
      .get('records')
      .remove({ id })
      .write();
  
    res.status(200).send(record);
  };
  
  exports.updateRecord = (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
  
    const record = db
      .get('records')
      .find({ id })
      .assign(data)
      .write();
  
    res.status(200).send(record);
  };