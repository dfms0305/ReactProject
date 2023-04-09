'use strict';

// load package
const express = require('express');
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors())
const mysql = require('mysql');

const PORT = 8080;
const HOST = '0.0.0.0';

var connection = mysql.createConnection({
    host: 'mysql1',
    user: 'root',
    password: 'admin'
});

connection.connect((err) => {
    if(err) console.log("Database is not connected");
    console.log("Database is connected");
});

/*
Create database for users, messages and reactions if this don't exist
Console log errors and responses
*/
connection.query('CREATE DATABASE IF NOT EXISTS chasquidb', (err) => {
    if(err) console.log(err);
    console.log("chasquidb created");
});

connection.query('USE chasquidb', (err) => {
    if(err) console.log(err);
    console.log("chasquidb selected");
});

connection.query('CREATE TABLE IF NOT EXISTS users (user_id INT UNSIGNED AUTO_INCREMENT, \
    user_name VARCHAR(20) NOT NULL, user_password VARCHAR(20) NOT NULL, UNIQUE (user_name), PRIMARY KEY (user_id))', (err) => {
    if(err) console.log(err);
    console.log("users table created");
});

connection.query('CREATE TABLE IF NOT EXISTS channels (channel_id INT UNSIGNED AUTO_INCREMENT, \
    channel_name VARCHAR(20) NOT NULL, member_id INT UNSIGNED NOT NULL, UNIQUE (channel_name), PRIMARY KEY (channel_id))', (err) => {
    if(err) console.log(err);
    console.log("channels table created");
});

connection.query('CREATE TABLE IF NOT EXISTS messages (message_id INT UNSIGNED AUTO_INCREMENT, \
    message_text VARCHAR(80) NOT NULL, channel_id INT UNSIGNED NOT NULL, owner_id INT UNSIGNED NOT NULL, message_ref_id INT UNSIGNED, \
    message_likes INT UNSIGNED, message_dislikes INT UNSIGNED, PRIMARY KEY (message_id))', (err) => {
    if(err) console.log(err);
    console.log("messages table created");
});

connection.query('INSERT IGNORE INTO users SET user_name="admin", user_password="admin"', (err, output) => {
    if(err) console.log(err);
    console.log("Admin Created")
});


app.post('/newUser', (req, res) => {
    let query = connection.query('INSERT INTO users SET ?', req.body, (err, output) => {
        if(err) {
            console.log(err);
            return res.json([]);
        } else {
            return res.json(output);
        }   
    })
});

app.post('/oldUser', (req, res) => {
    let query = connection.query('SELECT user_id, user_name FROM users WHERE user_name=? AND user_password=? LIMIT 1', [req.body.user_name, req.body.user_password], (err, output) => {
        if(err) console.log(err);
        return res.json(output);
    })
})

app.get("/showUsers", (req, resp) => {
    let query = connection.query('SELECT user_id, user_name FROM users WHERE user_id!=8080', (err, result) => {
        if(err) throw err;
        return resp.json(result);
    })
})

app.delete("/deleteUser/:user_id", (req, resp) => {
    let query1 = connection.query('DELETE FROM users WHERE user_id=?', [req.params.user_id], (err, result) => {
        if(err) throw err;
    })
    let query2 = connection.query('DELETE FROM messages WHERE owner_id=? AND message_id <> 0', [req.params.user_id], (err, result) => {
        if(err) throw err;
        return resp.json(result);
    })
})

app.post('/newChannel', (req, res) => {
    let query = connection.query('INSERT INTO channels SET ?', req.body, (err, output) => {
        if(err) console.log(err);
        return res.json(output);
    })
});

app.get("/showChannels", (req, resp) => {
    let query = connection.query('SELECT channel_id, channel_name FROM channels', (err, result) => {
        if(err) throw err;
        return resp.json(result);
    })
})

app.delete("/deleteChannel/:channel_id", (req, resp) => {
    let query1 = connection.query('DELETE FROM channels WHERE channel_id=?', [req.params.channel_id], (err, result) => {
        if(err) throw err;
    })

    let query2 = connection.query('DELETE FROM messages WHERE channel_id=? AND message_id <> 0', [req.params.channel_id], (err, result) => {
        if(err) throw err;
        return resp.json(result);
    })

})

app.get("/openChannel/:channel_id", (req, resp) => {
    let query = connection.query('SELECT channel_name, member_id FROM channels WHERE channel_id=?', [req.params.channel_id],  (err, result) => {
        if(err) throw err;
        return resp.json(result);
    })
})

app.post('/newMessage', (req, res) => {
    let query = connection.query('INSERT INTO messages SET ?', req.body, (err, output) => {
        if(err) console.log(err);
        return res.json(output);
    })
});

app.get("/showMessages/:channel_id", (req, resp) => {
    let query = connection.query('SELECT m.message_id, m.message_text, m.message_likes, m.message_dislikes, r.message_text AS ref_text, u.user_name \
                                FROM messages AS m \
                                LEFT JOIN messages AS r \
                                ON m.message_ref_id = r.message_id \
                                INNER JOIN users AS u \
                                ON m.owner_id = u.user_id \
                                WHERE m.channel_id=?', [req.params.channel_id], (err, result) => {
        if(err) throw err;
        return resp.json(result);
    })
})

app.put("/likeMessage", (req, res) => {
    let query = connection.query('UPDATE messages \
                                SET message_likes=message_likes+1 \
                                WHERE message_id=?', [req.body.message_id], (err, result) => {
        if(err) console.log(err);
        return res.json(result);
    })
})

app.put("/dislikeMessage", (req, res) => {
    let query = connection.query('UPDATE messages \
                                SET message_dislikes=message_dislikes+1 \
                                WHERE message_id=?', [req.body.message_id], (err, result) => {
        if(err) console.log(err);
        return res.json(result);
    })
})

app.delete("/deleteMessage/:message_id", (req, resp) => {
    let query = connection.query('DELETE FROM messages WHERE message_id=?', [req.params.message_id], (err, result) => {
        if(err) throw err;
        return resp.json(result);
    })
})



app.use(express.static('public'));

app.listen(PORT, HOST, () => {
    console.log('up and running');
});

