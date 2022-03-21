const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
// link to where the notes will be stored
const notes = require('./db/db.json');
//the port number to run the application
const PORT = process.env.PORT || 3011;


//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.json(notes.slice(1));
});

//this is bringin the first part of the html to connect with the server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
//this is bringin the second html connect with the server
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//this is what will be creating the new note and storing it into the json file. it also is giving the notes different ids so that when it deletes its easier to find like in the module
function NewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    
    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

app.post('/api/notes', (req, res) => {
    const newNote = NewNote(req.body, notes);
    res.json(newNote);
});

//this is the function to get rid of the notes
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, notes);
    res.json(true);
});

//standard terminal message to show the the is working
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});