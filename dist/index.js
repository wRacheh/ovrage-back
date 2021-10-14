"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_1 = __importDefault(require("./book"));
const body_parser_1 = __importDefault(require("body-parser"));
const serve_static_1 = __importDefault(require("serve-static"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(serve_static_1.default("public"));
const uri = "mongodb://localhost:27017/biblio";
mongoose_1.default.connect(uri, (err) => {
    if (err) {
        console.log(err, "Erreur de connection à la base de donnée!");
    }
    else {
        console.log("Mongo db connection sucess");
    }
});
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});
app.get("/", (req, resp) => {
    resp.send("Hello world");
});
app.get("/books", (req, resp) => {
    book_1.default.find((err, books) => {
        if (err) {
            resp.status(500).send(err);
        }
        else {
            resp.send(books);
            console.log(resp);
        }
    });
});
app.get("/books/:id", (req, resp) => {
    book_1.default.findById(req.params.id, (err, book) => {
        if (err) {
            resp.status(500).send(err);
        }
        else {
            resp.send(book);
        }
    });
});
app.post("/books", (req, resp) => {
    let book = new book_1.default(req.body);
    book.save(err => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(book);
    });
});
app.put("/books/:id", (req, resp) => {
    book_1.default.findByIdAndUpdate(req.params.id, req.body, (err, book) => {
        if (err)
            resp.status(500).send(err);
        else {
            resp.send("Successfuly updated book");
        }
    });
});
app.delete("/books/:id", (req, resp) => {
    book_1.default.deleteOne({ _id: req.params.id }, err => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("Successfuly deleted Book");
    });
});
app.listen(8700, () => {
    console.log("Server Started on port %d", 8700);
});
app.get("/pbooks", (req, resp) => {
    let p = 1;
    let size = 5;
    book_1.default.paginate({}, { page: p, limit: size }, function (err, result) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(result);
    });
});
app.get("/books-serach", (req, resp) => {
    let p = 1;
    let size = 5;
    let keyword = '';
    book_1.default.paginate({ title: { $regex: ".*(?i)" + keyword + ".*" } }, { page: p, limit: size }, function (err, result) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(result);
    });
});
