module.exports = {
    AUTH0_DOMAIN: 'scapers.auth0.com',
    AUTH0_API_AUDIENCE: 'http://localhost:8083/api/',
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost/scapers',
    NAMESPACE: 'http://scapers.io/roles'
};