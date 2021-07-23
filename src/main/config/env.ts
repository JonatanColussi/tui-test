export default {
  mongoUrl:
    process.env.MONGO_URL ||
    'mongodb://localhost:27017/tui-test',
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'Development',
  amadeus: {
    host: process.env.AMADEUS_HOST || 'https://test.api.amadeus.com',
    clientId: process.env.AMADEUS_CLIENT_ID || 'iJGGFO4IETiUrLBLAz3Cwu5N81AF62qQ',
    secret: process.env.AMADEUS_SECRET || '1l0CYsrSVgmBnH4D'
  }
}
