import express, {type Express, type Request, type Response} from 'express';
import {matchRouter} from "@/routes/matches";


const app: Express   = express();
const port: string | 8000 = process.env.PORT || 8000;

app.use(express.json());

app.get('/', (req: Request, res: Response): void => {
    res.send('Hello World!');
})

app.use('/matches', matchRouter);


app.listen(port, (): void => {
    console.log(`Listening on port ${port}`);
})
