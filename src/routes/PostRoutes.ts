import { Request, Response, Router } from 'express';
import Post from "../models/Post";

class PostRoutes {
    router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }

    async getPost(req: Request, res: Response): Promise<void> {
        //console.log(req.params.url);
        const post = await Post.findOne({url: req.params.url});
        res.json(post);
    }

    async getPosts(req: Request, res: Response): Promise<void> {
        const posts = await Post.find();
        res.json(posts);
    }

    async createPost(req: Request, res: Response): Promise<void> {
        //console.log(req.body);
        const { title, url, content, image } = req.body;
        const newPost = new Post({ title, url, content, image })/*.save((err, post) => {})*/;
        //console.log(newPost);
        await newPost.save(/*(err: any, post: any) => {
            if (err) return res.status(400).json({
                ok: false,
                err
            });
            res.json({
                ok: true,
                post
            });
        }*/);
        res.json({data : newPost});
    }

    async updatePost(req: Request, res: Response): Promise<void> {
        const { url } = req.params;
        //console.log(req.params.url);
        //console.log(req.body);
        const post = await Post.findOneAndUpdate({url}, req.body, {new: true});
        res.json(post);
    }

    async removePost(req: Request, res: Response): Promise<void> {
        const { url } = req.params;
        const post = await Post.findOneAndDelete({url});
        res.json(post);
    }

    routes() {
        this.router.get('/', this.getPosts);
        this.router.get('/:url', this.getPost);
        this.router.post('/', this.createPost);
        this.router.put('/:url', this.updatePost);
        this.router.delete('/:url', this.removePost);
    }
}

const postRoutes = new PostRoutes();
export default postRoutes.router;