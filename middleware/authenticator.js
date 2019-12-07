// looks for the header, based on the header, find by token if the user exists; checks: did i get back un user? if not throw an error, if yes move on to the controller
// wenn in route: first runs the middleware function, then controller

// checks if validation is valid, then moves to the controller

const User = require('../models/User');
const createError = require('http-errors');  //sonst kommt Fehlermeldung not defined

const auth = async (req, res, next) => {
    try {
        const token = req.header('x-auth');
        const user = await user.findByToken(token);
        if (!user) throw new createError.NotFound();
        
        req.user = user;        //wird in usersC. benutzt; req.user nirgendwo
        next();     //goes from middleware to controller
    } catch (e) {
        next(e);
    }
};

module.exports = auth;  // ist in users.js