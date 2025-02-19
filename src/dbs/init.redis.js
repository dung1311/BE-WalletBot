'use strict';
const {createClient} = require('redis');
const dotenv = require("dotenv");
dotenv.config();
const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
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

module.exports = {client, RedisConnection};

 

