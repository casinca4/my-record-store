// console.log('I AM A SEED SCRIPT');

const mongoose = require('mongoose');
const faker = require('faker');
const User = require('../models/User');         //model is wie class, schema is wie constructor, deswegen großes U

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


    try {
        // await Promise.all(userPromises);
        await User.deleteMany({});
        // console.log('Users stored in the database!')
        console.log('Old users moved to a better place. Spandau')
    } catch (e) {
        console.log(e)
    }


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
                userName: faker.internet.userName()
            });
            return user.save();                     //save: returns a promise
        });

    // console.log(userPromises);

    try {
        await Promise.all(userPromises);
        console.log('Users stored in the database!');
    } catch (e) {
        console.log(e);
    }

    mongoose.connection.close();
    //promise, weil man alles gruppieren möchte und dann erst in db
})();                                   //Funktion ruft sich selbst auf

