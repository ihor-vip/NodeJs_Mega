const express = require('express');
const {engine} = require('express-handlebars');
const DB = require('./dataBase/users')

const app = express();

app.engine('.hbs', engine({defaultLayout: false}));
app.set('view engine', '.hbs');
app.set('views', './static');

app.get('/', (req, res) => {
    res.json('hi')
})

app.get('/users', (req, res) => {
    res
        .status(200)
        .json(DB)
})

app.get('/users/:id', (req, res) => {
    const {id} = req.params;

    res
        .status(200)
        .json(DB[id] || {})
})

app.get('/home', (req, res) => {
    res.render('welcome', {page: 'this is home page'})
})

app.listen(5000, () => {
    console.log('App listen 5000');
})