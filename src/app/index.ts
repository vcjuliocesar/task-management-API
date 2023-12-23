import express, { Request, Response } from 'express'

const app = express()

app.use(express.json()) // middleware que transforma la req.body a JSON

const PORT = 3000

app.get('/test',(_req:Request,res:Response) => {
    console.log('Hi!!')
    res.send('Successful')
})


app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})