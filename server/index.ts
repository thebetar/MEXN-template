// Simple express server
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(
	cors({
		origin: process.env.CORS_URL,
	}),
);
app.use(bodyParser.json());

app.use('/', (req, res) => res.send('Server is working'));

app.listen(process.env.PORT || 3000, async () => {
	console.log('Server started on port 3000');

	await mongoose.connect(`${process.env.MONGO_URL}/${process.env.MONGO_DATABASE}`);
});
