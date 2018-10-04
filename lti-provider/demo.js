var express = require("express"),
    bodyParser = require("body-parser");
app = express();

const port = 3000;

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("hello"));
app.get("/1", (req, res) => {   
    res.send("/1 page");  
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});