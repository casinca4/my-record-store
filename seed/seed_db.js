// mongoose-seed lets you populate and clear MongoDB documents with all the benefits of Mongoose validation
// populate: lets you reference documents in other collections
// console.log('I AM A SEED SCRIPT');

const mongoose = require('mongoose');
const faker = require('faker');
const User = require('../models/User');         //model is wie class, schema is wie constructor, deswegen großes U
const Record = require('../models/Record');
const Order = require('../models/Order');

(async function () {
    /** CONNECT TO MONGO */
    mongoose.connect('mongodb://localhost:27017/MyRecordStore', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });

    mongoose.connection.on(
        'error',
        console.error.bind(console, 'connection error:')
    );

    mongoose.connection.on('open', () => {
        console.log(`Connected to the database...`);
    });


    console.log('First, I wil delete all the old users');       //brauchen wir, da sich die 20 users bei jedem Mal addieren


    // Promise.all(userPromises).then(data => 
    //     console.log('Users stored in the database!')
    //     );
    //alte Methode


    /* DELETE ALL USERS */
    try {
        // await Promise.all(userPromises);
        await User.deleteMany({});                              //User groß, da vom model
        // console.log('Users stored in the database!')
        console.log('Old users moved to a better place. Spandau')
    } catch (e) {
        console.log(e)
    }


    /** DELETE ALL RECORDS */
    try {
        await Record.deleteMany({});
        console.log('Old records moved to a better place. Spandau');
    } catch (e) {
        console.log(e);
    }


    /** DELETE ALL ORDERS */
    try {
        await Order.deleteMany({});
        console.log('Old orders moved to a better place. Spandau');
    } catch (e) {
        console.log(e);
    }
    console.log(`I am creating 20 fake users`);


    //CREATE 20 FAKE USERS"
    console.log('I am creating 20 fake users');


    const userPromises = Array(20)
        .fill(null)                          //kann auch 0 sein; man muß etwas haben, oder leer; fill ist wie ein placeholder
        .map(() => {                        //el brauchen wir nicht, weil wir es nicht benutzen
            const user = new User({         //User: the model we imported oben
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                birthday: faker.date.past(),
                userName: faker.internet.userName(),
                address: {
                    city: faker.address.city(),
                    street: faker.address.streetName()
                }
            });

            return user.save();                     //save: Please save this; returns a promise
        });

    // console.log(userPromises);

    try {
        await Promise.all(userPromises);
        console.log('Users stored in the database!');
    } catch (e) {
        console.log(e);
    }


    /** CREATE 20 FAKE RECORDS */
    const recordPromises = Array(20)
        .fill(null)
        .map(() => {
            const record = new Record({
                title: faker.random.words(),
                artist: faker.internet.userName(),
                year: new Date(faker.date.past()).getFullYear(),
                price: faker.finance.amount()
            });

            return record.save();
        });

    try {
        await Promise.all(recordPromises);
        console.log('Records stored in the database!');
    } catch (e) {
        console.log(e);
    }

    mongoose.connection.close();
    //promise, weil man alles gruppieren möchte und dann erst in db
})();                                   //Funktion ruft sich selbst auf

