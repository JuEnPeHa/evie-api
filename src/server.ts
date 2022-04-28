import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import PostRoutes from './routes/PostRoutes';
import UserRoutes from './routes/UserRoutes';
import indexRoutes from './routes/indexRoutes';
import helmet from 'helmet';
import NEARRoutes from './routes/NEARRoutes';
// async function connectNEAR() {
//     const near = await nearAPI.connect({
//         networkId, nodeUrl, walletUrl,
//     });
// }

    async function testNEAR() {
//    const methodOptions = {
//      viewMethods: ['nftTotalSupply'],
//      changeMethods: []
//    };
//    const contract = new nearAPI.Contract(
//     account,
//      'paras-token-v2.testnet',
//      methodOptions
//    );
    }



    async function connectDB() {
        const MONGO_URI = '';
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
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(morgan('dev'));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());
    }

    routes() {
        this.app.use(indexRoutes);
        this.app.use('/api/posts', PostRoutes);
        this.app.use('/api/users', UserRoutes);
        this.app.use('/api/near', NEARRoutes);
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }

}

const server = new Server();
server.start();
