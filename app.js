const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
mongoose.connect("mongodb://0.0.0.0:27017/hbdatabase")
.then(()=> console.log("connection successful"))
.catch((err)=> console.log(err));

const reviewSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        maxlength: 500
    },
    rating : {
        type: Number,
        require: true,
        min :1,
        max: 5
    },
    author: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})
const movieSchema= new mongoose.Schema({
    title : {
        type: String,
        required: true,
        maxlength: 255
    },
    description : {
        type: String,
        required: true,
        maxlength: 1000
    },
    genre : {
        type: String,
        required: true,
    },
    releaseYear : {
        type: Number,
        required: true,
        max: 2023,
        min: 1800
    },
    reviews : [reviewSchema]

})


const Movie = new mongoose.model("Movie", movieSchema);

app.get("/", (req, res)=> {
    res.send("home page");
})
app.post("/api/movies", async(req, res)=> {
    try{
        const moviesData = await Movie.find();
        console.log(moviesData);
        res.send(moviesData);
    }
    catch(err){
        console.log(err);
    }
})

app.post("/api/movies", async(req, res) => {
    try{
        const newMovie = new Movie(req.body);
        const createMovie = await newMovie.save();
        res.status(201).send(createMovie);
    }catch(e){
        res.status(400).send(e);
    }
})

// get the individual movie data
app.get("/api/movies/:id", async (req, res)=> {
    try{
        const _id = req.params.id;
        const movieData = await Movie.findById({_id: _id});
        if(!movieData){
            return res.status(404).send();
        }
        else{
            res.send(movieData);
        }
    }
    catch(e){
        res.send(e);
    }
})

// UPDATE REQUEST BY ID
app.put("/api/movies/:id", async (req, res)=> {
    try{
        const _id = req.params.id;
        const updateMovie = await Movie.findByIdAndUpdate({_id: _id}, req.body, {
            new : true
        });
        console.log(updateMovie);
        res.send(updateMovie);
    }
    catch(e){
        res.status(404).send(e);
    }
})

//DELETE REQUEST
app.delete("api/movies/:id", async(req, res)=> {
    try{
        const id = req.params.id;
        const deleteMovie = await Movie.findByIdAndDelete(id);
        if(!id) return res.status(400).send();
        res.send(deleteMovie);
    }
    catch(e){
        res.status(500).send(e);
    }
})

// getting the REVIEWS
app.get("/api/movies/:id/reviews", async(req, res)=> {
    try{
        const id = req.params.id;
        const movieData = await Movie.findById(id);
        if(!id) return res.status(400).send();
        res.send(movieData.reviews);
    }
    catch(err){
        res.send(err);
    }
})
// POSTing a review
app.post("/api/movies/:id/reviews", async(req, res)=> {
    try{
        const id = req.params.id;
        const movieData = await Movie.findById(id);
        movieData.reviews = req.body;
        const createMovieReviews = await newMovie.save();
        res.status(201).send(createMovieReviews);
    }catch(e){
        res.status(400).send(e);
    }
})


app.listen(port, ()=> {
    console.log(`the server is running on ${port}`);
})




