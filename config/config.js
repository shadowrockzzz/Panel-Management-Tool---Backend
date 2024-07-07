export default {
    database: {
      uri: 'mongodb+srv://vssnreddy:saivelagala@netflixsnoop.dleh4th.mongodb.net/?retryWrites=true&w=majority&appName=NetflixSnoop', // MongoDB connection URI
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    },
    tokens: {
      jwtSecret: 'Anil_Sir_Given_Assignment_03_04_1999',
      jwtExpiration: '7d'
    }
  };