'use strict';
const {createClient} = require('redis');
const session = require('express-session');
const dotenv = require("dotenv");
const {RedisStore} = require('connect-redis');
dotenv.config();
const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

const redisSession = session({
    store: new RedisStore({
        client: client,
        ttl: process.env.REDIS_EXPIRY,
    }),
    secret: process.env.REDIS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
});

class RedisConnection {
    static async connect(){
        client.on('error', (err) => console.error('❌ Redis Error:', err));
        try {
            if (!client.isOpen) {
                await client.connect();
                console.log("✅ Redis Connected!");
            }
        } catch (err) {
            console.error("❌ Redis Connection Failed:", err);
        }
    };
}

module.exports = {client, redisSession, RedisConnection};

 

