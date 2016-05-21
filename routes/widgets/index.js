var checkAuth = require('../../libs/middleware/checkAuth');
module.exports = function(app){

	app.get('/widgets/usersTab', checkAuth, require('./usersTabWidgets').get);

};