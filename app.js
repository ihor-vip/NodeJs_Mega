const express = require('express');
const mongoose = require('mongoose');

const userRouter = require('./routes/user.router')
const {PORT} = require('./config/config')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

mongoose.connect('mongodb://localhost:27017/my_database').then(() => {
    console.log('Connection success');
})

app.use('/users', userRouter);

app.all('*',(err, res, req, next) => {

})

app.listen(PORT, () => {
    console.log(`App listen port ${PORT}`);
});