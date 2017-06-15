var Sequelize = require('sequelize'),
    _ = require('lodash'),
    User = require('../models/user.js');

exports.create = function (req, res) {
    var allowedKeys = ['email', 'other_field'];
    var attributes = _.pick(req.body, allowedKeys);
    User.create(attributes)
        .then(function (user) {
            res.json(user);
        })
        .catch(Sequelize.ValidationError, function (err) {
            // respond with validation errors
            return res.status(422).send(err.errors);
        })
        .catch(function (err) {
            // every other error
            return res.status(400).send({
                message: err.message
            });
        });