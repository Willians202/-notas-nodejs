const mongoose = require('mongoose');
const Note = require('./models/note');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
    const notes = [
      { title: 'Nota 1', content: 'Hola mundo' },
      { title: 'Nota 2', content: 'RD campeon' },
      { title: 'Nota 3', content: 'Saludos' }
    ];
    return Note.insertMany(notes);
  })
  .then(() => {
    console.log('Data inserted');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error(error);
    mongoose.connection.close();
  });