// Importing tools

const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const morgan = require('morgan');

// Creating the application

const app = express();
const port = 3000;

// Middleware

app.use(morgan('default'));
app.use(express.json());
app.use(cors());

// Creating the database

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.db',
});

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

sequelize.sync().then(() => {
    console.log('Database synced');
});

// API endpoints

app.post('/users', async (req, res) => {
    try {
        const { name, country } = req.body;
        const newUser = await User.create({ name, country });
        res.json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

app.put('/users/:id', async (req, res) => {
    try {
        const { name, country } = req.body;
        const user = await User.findByPk(req.params.id);

        if (user) {
            user.name = name;
            user.country = country;
            await user.save();
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.json({ message: 'User deleted' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Starting the server

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});