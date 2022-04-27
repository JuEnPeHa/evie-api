import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import PostRoutes from './routes/PostRoutes';
import UserRoutes from './routes/UserRoutes';
import indexRoutes from './routes/indexRoutes';
import helmet from 'helmet';

    async function connectDB() {
        const MONGO_URI = 'mongodb+srv://efwcwwwwce:7sPtSf8mzuTAqfGx@cluster0.w0ka0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
        const db = await mongoose.connect(MONGO_URI || process.env.MONGODB_URI).then(db => console.log('DB connected', db.connection.db.databaseName)).catch(err => console.log(err));
    }

class Server {
    app: express.Application;

    constructor() {
    this.app = express();
    this.config();
    this.routes();
    }

    config() {
        connectDB();
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());
    }

    routes() {
        this.app.use(indexRoutes);
        this.app.use('/api/posts', PostRoutes);
        this.app.use('/api/users', UserRoutes);
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }

}

const server = new Server();
server.start();