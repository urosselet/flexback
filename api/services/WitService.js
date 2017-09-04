const { Wit, log } = require('node-wit');

const client = new Wit({
  accessToken: '2FDYYZEAPD3DC54EYNR25WVQD54U25LL',
  logger: new log.Logger(log.DEBUG) // optional
});

module.exports = {

    message: function(option, cb) {
        console.log(client.message('set an alarm tomorrow at 7am'));
    }

}