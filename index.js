const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
app.use(express.json())

require('dotenv').config();

const users = [];

// to get users
app.get('/users', (req, res) => {
    res.json(users);
})

// to create users
app.post('/users', async (req, res) => {
    try {
        // its an async function so we need to use await
        brcyptPassword = await bcrypt.hash(req.body.password, 10 )
        const user = { name: req.body.name, password: brcyptPassword }
        users.push(user);
        const payload = req.body.name;
        const token = jwt.sign(payload, process.env.JWT_TOKEN); 
        console.log(token)
        return res.status(200).json({message: "created", token})

    } catch (err) {
        console.log(err)
    }
})

// for login
app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name);
    // creating a token
    if (!user) {
        return res.status(400).send('cant find user');
    }

    try {
        const passwordAuth = await bcrypt.compare(req.body.password, user.password)
        if (!passwordAuth) {
            return res.status(500).send("password didnt match")
        }

        return res.status(200).json({message: "success"})

    } catch (error) {
        console.log(error)
    }
})

// Posts
const posts = [
    {
        name: "haris",
        id:'1'
    },
    {
        name: "khan",
        id:'2'
    }
]

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    console.log('authtoken', token);
    if (token == null) {
        return res.sendStatus(401); // No token provided
    }


    jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden: Token is invalid
        }
        req.user = user; // Attach user information to the request object for further processing
        next(); // Pass the control to the next middleware
    });
}



// to get posts
app.get('/posts', verifyToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
})
const PORT = process.env.PORT || 3000
app.listen(3000, () => {
    console.log(`Listening on Port ${PORT}`)
});