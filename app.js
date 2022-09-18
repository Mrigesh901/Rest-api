const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ejs = require('ejs')
const app = express()

app.set('viewEngine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article",articleSchema);


app.route("/articles")
    .get(function(req,res){
    Article.find(function(err, foundArticles){
        if (!err){
        res.send(foundArticles);
    }
    else{
        console.log(err)
    }
});
    })
    .post(function(req, res){
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        }) ;
    
        newArticle.save(function(err){
            if (!err){
                res.send("Data saved successfully");
            } else {
                res.send(err);
            }
        });
        
    })
    .delete(function(req,res){
        Article.deleteMany(function(err){
            if (!err){
                res.send("Deleted successfully")
            } else { 
                res.send(err)
            }
        })
    });


app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if (foundArticle){
            res.send(foundArticle)
        } else {
            res.send("No matching article found");
        }
    });
})


.put(function(req, res){
    Article.replaceOne(
        {title: req.params.articleTitle}, 
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if (!err){
                res.send("Successfully updated article")
            } else {
                console.log(err)
            }
        }
    )
})


.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if (!err){
                res.send("Successfully updated")
            } else {
                res.send(err)
            }
        }
    )
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if (!err){
                res.send("Successfully deleted")
            } else {
                res.send(err)
            }
        }
    )
});




app.listen(3000, function(){
    console.log("Server is listning on port 3000");
})




// app.get("/articles", function(req,res){
//     Article.find(function(err, foundArticles){
//         if (!err){
//         res.send(foundArticles);
//     }
//     else{
//         console.log(err)
//     }
// });
//     })


// app.post("/articles", function(req, res){
//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     }) ;

//     newArticle.save(function(err){
//         if (!err){
//             res.send("Data saved successfully");
//         } else {
//             res.send(err);
//         }
//     });
    
// });


// app.delete("/articles", function(re,res){
//     Article.deleteMany(function(err){
//         if (!err){
//             res.send("Deleted successfully")
//         } else { 
//             res.send(err)
//         }
//     })
// })