import { Request, Response, Router } from 'express';
import User from "../models/User";

class UserRoutes {
    router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }

    async getUser(req: Request, res: Response): Promise<void> {
        //console.log(req.params.url);
        const user = await User.findOne({username: req.params.username}).populate('posts');
        res.json(user);
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        const users = await User.find();
        res.json(users);
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const newUser = new User( req.body )/*.save((err, post) => {})*/;
        //console.log(newPost);
        await newUser.save(/*(err: any, user: any) => {
            if (err) return res.status(400).json({
                ok: false,
                err
            });
            res.json({
                ok: true,
                user
            });
        }*/);
        res.json({data : newUser});
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        const { username } = req.params;
        //console.log(req.params.url);
        //console.log(req.body);
        const user = await User.findOneAndUpdate({username}, req.body, {new: true});
        res.json(user);
    }

    async removeUser(req: Request, res: Response): Promise<void> {
        const { username } = req.params;
        const user = await User.findOneAndDelete({username});
        res.json(user);
    }

    routes() {
        this.router.get('/', this.getUsers);
        this.router.get('/:username', this.getUser);
        this.router.post('/', this.createUser);
        this.router.put('/:username', this.updateUser);
        this.router.delete('/:username', this.removeUser);
    }
}

const userRoutes = new UserRoutes();
export default userRoutes.router;