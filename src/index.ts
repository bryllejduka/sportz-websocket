import express, {Express, Request, Response} from 'express';

const app: Express   = express();
const port: string | 3000 = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response): void => {
    res.send('Hello World!');
})

app.listen(port, (): void => {
    console.log(`Listening on port ${port}`);
})
