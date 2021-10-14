import express, { Request, Response } from 'express';
import Book from "./book";
import bodyParser from "body-parser";
import serveStatic from "serve-static";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(serveStatic("public"));
const uri: string = "mongodb://localhost:27017/biblio";
mongoose.connect(uri, (err) => {
    if (err) { console.log(err, "Erreur de connection à la base de donnée!"); }
    else { console.log("Mongo db connection sucess",); }
});
app.use((req, res, next)=>{  
    res.setHeader("Access-Control-Allow-Origin", "*");  
    res.setHeader(  
        "Access-Control-Allow-Headers",  
        "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader("Access-Control-Allow-Methods",  
    "GET, POST, PUT, PATCH, DELETE, OPTIONS");    
    next();  
}); 
app.get("/", (req: Request, resp: Response) => {
    resp.send("Hello world");
});

app.get("/books", (req: Request, resp: Response) => {
    Book.find((err, books) => {
        if (err) { resp.status(500).send(err); }
        else { resp.send(books);
        console.log(resp) }
    })
});

app.get("/books/:id", (req: Request, resp: Response) => {
    Book.findById(req.params.id, (err: any, book: any) => {
        if (err) { resp.status(500).send(err); }
        else { resp.send(book); }
    });
});

app.post("/books", (req: Request, resp: Response) => {
    let book = new Book(req.body);
    book.save(err => {
        if (err) resp.status(500).send(err);
        else resp.send(book);
    })
});

app.put("/books/:id", (req: Request, resp: Response) => {
    Book.findByIdAndUpdate(req.params.id, req.body, (err, book) => {
        if (err) resp.status(500).send(err);
        else {
            resp.send("Successfuly updated book");
        }
    })
});

app.delete("/books/:id", (req: Request, resp: Response) => {
    Book.deleteOne({ _id: req.params.id }, err => {
        if (err) resp.status(500).send(err);
        else resp.send("Successfuly deleted Book");
    });
});

app.listen(8700, () => {
    console.log("Server Started on port %d", 8700);
});

app.get("/pbooks",(req:Request,resp:Response)=>{
    let p=1;
    let size=5;
    Book.paginate({}, { page: p, limit: size }, function(err, result) {
    if(err) resp.status(500).send(err);
    else resp.send(result);
    });
    });

    app.get("/books-serach",(req:Request,resp:Response)=>{
        let p= 1;
        let size=5;
        let keyword='';
        Book.paginate({title:{$regex:".*(?i)"+keyword+".*"}}, { page: p, limit:
        size }, function(err, result) {
        
        if(err) resp.status(500).send(err);
        else resp.send(result);
        });
        });