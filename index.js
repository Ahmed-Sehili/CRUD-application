// Importing tools

const express = require('express');
const fs = require('fs');

// Creating the application

const app = express();
const port = 3000;

// Middleware

app.use(express.json());

// Reading from the 'database'

const readData = () => {
    try {
        const data = fs.readFileSync('data.json');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error getting data:', error);
        return []
    }
};

// API endpoint for getting all data

app.get('/data', (_, res) => {
    const data = readData();
    res.status(200).json(data);
});

// API endpoint for getting data by id

app.get('/data/:id', (req, res) => {
    const data = readData();
    const student = data.find(i => i.id === parseInt(req.params.id));

    if (student) {
        res.status(200).json(student);
    } else {
        res.status(404).send('Student not found');
    }
});

// API endpoint for updating data by id

app.put('/data/:id', (req, res) => {
    let data = readData();
    let student = data.find(i => i.id === parseInt(req.params.id));
    
    if (student) {
        Object.assign(student, req.body);

        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
        res.status(200).json(data);

    } else {
        const newStudent = { id: parseInt(req.params.id), ...req.body };
        data.push(newStudent);

        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
        res.status(201).json(newStudent);
    }
});

// API endpoint for adding new data

app.post('/data', (req, res) => {
    const data = readData();

    const newStudent = { id: Date.now(), ...req.body };
    data.push(newStudent);

    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    res.status(201).json(newStudent);
});

// API endpoint for deleting data by id

app.delete('/data/:id', (req, res) => {
    let data = readData();

    const studentExists = data.some(i => i.id === parseInt(req.params.id));

    if (!studentExists) {
        return res.status(404).send('Student not found');
    }
    
    data = data.filter(i => i.id !== parseInt(req.params.id));
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    
    res.status(204).send();
});

// Starting the server

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});