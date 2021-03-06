const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const db = require('./Database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());


server.get('/', (req, res) => {
    res.send('Hello!');
  });

//endpoints

//Display a list of notes
 server.get('/notes', async (req, res) => {
     db('notes')
    .then(notes => {
         res.status(200).json(notes)
     })
     .catch(error => {
         res.status(500).json({ error:'Unable to display notes' })
     })
 });



//view an existing note
server.get('/notes/:id', async (req, res) => {
   const { id } = req.params;
   db('notes')
   .where({ id })
   .then(response => {
      if (note) {
        res.status(200).json(response);
    }
    else {
      res.status(404).json({error: 'The note is not'});
     }
     })
   .catch(error => res.status(500).json({ error:'Cannot view note'}));
 });





//Create a note with title and content
server.post('/notes',async (req, res) => {
    const { title, content } = req.body;
    if (!title && !content) {
      res.status(400).json({ error:'Please provide a title and some content'})
    }
    db.insert({ title, content })
    .into('notes')
    .then(response => {
      res.status(201).json(response)
    })
    .catch(error => {
      res.status(500).json({ error:'Note not Created' })
    })
  });

//edit a note
server.put('/notes/:id', async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  db('notes')
  .where('id', id)
  .update({ title, content })
  .then(response => {
      res.status(200).json(response)
  })
  .catch(err => {
    res.status(500).json({ error: 'Note Cannot be Edited at this time'})
  })
})

//Delete an existing note
server.delete('/notes/:id', async (req, res) => {
    const { id } = req.params;
    
    db('notes')
    .where({id: id})
    .delete()
    .then(count => {
      if(count === 0) {
        res.status(404).json({ error: 'Note with this id does not exist in database'});
    }
    else {
        res.status(200).json({mesg: 'Not cannot be deleted'})
    }
    })
    .catch(error => {
        res.status(500).json({ error:'Unable to delete note' })
      })
});









const port = 8000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});