const express = require('express');

const userRouter = require('./routes/user.router')
const {PORT} = require('./config/config')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/users', userRouter);

app.listen(PORT, () => {
    console.log(`App listen port ${PORT}`);
});