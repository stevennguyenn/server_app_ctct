// config/auth.js

module.exports = {

    'facebookAuth': {
        'clientID': '264934664941810', // App ID của bản
        'clientSecret': '9d213140237e168861dfcefd8c6cda61', // App Secret của bạn
    },

    'googleAuth': {
        'clientID': 'your-secret-clientID-here',
        'clientSecret': 'your-client-secret-here',
        'callbackURL': 'http://localhost:8080/auth/google/callback'
    }

};