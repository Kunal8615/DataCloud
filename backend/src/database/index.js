import mongoose from 'mongoose';
import dotenv from 'dotenv';  // Add this import for dotenv
import { DB_NAME } from '../constant.js';

dotenv.config();  // Ensure dotenv is configured

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGO_URI}/${DB_NAME}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
        });
        console.log(`\n DataCloud MONGOOSE-DATABASE Connected || db host:
             ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log('Error in MongoDB connection', error);
        process.exit(1);
    }
};

export default connectDB;
