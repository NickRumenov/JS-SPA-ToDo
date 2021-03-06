﻿var app = app || {};

app.userController = (function () {
    function UserController(viewBag, model) {
        this.model = model;
        this.viewBag = viewBag;
    }

    UserController.prototype.loadLoginPage = function (selector) {
        this.viewBag.showLoginPage(selector);
    };

    UserController.prototype.login = function (data) {
        return this.model.login(data)
            .then(function (success) {
                sessionStorage['sessionId'] = success._kmd.authtoken;
                sessionStorage['username'] = success.username;
                sessionStorage['userId'] = success._id;

                Sammy(function () {
                    this.trigger('redirectUrl', { url: '#/home/' });
                });
            }, function (error) {
                alert('Invalid username or password. Please try again.');
            })
    };


    UserController.prototype.loadRegisterPage = function (selector) {
        this.viewBag.showRegisterPage(selector);
    };

    UserController.prototype.register = function (data) {
        if ((data.username && data.password) && (data.password === data.repeatPassword)) {
            return this.model.register(data).then(function (success) {
                sessionStorage['sessionId'] = success._kmd.authtoken;
                sessionStorage['username'] = success.username;
                sessionStorage['userId'] = success._id;

                Sammy(function () {
                    this.trigger('redirectUrl', { url: '#/home/' });
                });
            });
        } else {
            if (!data.username && !data.password) {
                alert('Please insert username and password.');
            }
            else if (!data.username) {
                alert('Please insert username.');
            }
            else if (!data.password) {
                alert('Please insert password.');
            }
            else if (data.password !== data.repeatPassword) {
                alert('Passwords are not equal.');
            }
        }
    };

    UserController.prototype.logout = function () {
        this.model.logout()
            .then(function () {
                sessionStorage.clear();

                Sammy(function () {
                    this.trigger('redirectUrl', { url: '#/' });
                });
            })
    };

    return {
        load: function (viewBag, model) {
            return new UserController(viewBag, model);
        }
    }
}());