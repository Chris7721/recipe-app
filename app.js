const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe')

const app = express();
mongoose.connect('mongodb+srv://chris007:61RluHEaVWfnfTh5@cluster0-hn8qt.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
				.then(()=>{
					console.log("Successfully connected to OngoDb database");
				})
				.catch((error)=>{
					console.log(error);
				});
app.use((req, res, next) => {//the middleware should always come before all routes so the header would be added for all request
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(bodyParser.json());//this receives the sers input and converts it to json format for use by the server

app.post('/api/recipes', (req, res, next)=>{
	const recipe =new Recipe({
		title: req.body.title,
		ingredients: req.body.ingredients,
		instructions: req.body.instructions,
		difficulty: req.body.difficulty,
		time: req.body.time

	});
	recipe.save().then(()=>{
		res.status(201).json({message:'Recipe saved successfully'})
	}).catch((error)=>{
		error
	})
})
app.get('/api/recipes/:id',(req, res, next)=>{
	Recipe.findOne({
		_id: req.params.id
	}).then((recipe)=>{
		res.status(200).json(recipe);
	}).catch((error)=>{
		res.status(400).json({error})
	})
	
});

app.put('/api/recipes/:id', (req, res)=>{
	const recipe =new Recipe({
		_id: req.params.id,//this particular is neccessary so the Update method woul used it to find this particular element too be modified
		title: req.body.title,
		ingredients: req.body.ingredients,
		instructions: req.body.instructions,
		difficulty: req.body.difficulty,
		time: req.body.time

	});
	Recipe.updateOne({_id: req.params.id}, recipe).then(()=>{
		res.status(200).json({message: 'Updated Successfully!!!'});
	}).catch((error)=>{
		res.status(400).json({error})
	})
});

app.delete('/api/recipes/:id', (req, res, next)=>{
	Recipe.deleteOne({_id: req.params.id}).then(()=>{
		res.status(200).json({message: 'Deleted Successfully'})
	}).catch((error)=>{
		res.status(400).json({error})
	})
})

app.use('/api/recipes',(req, res, next)=>{
	Recipe.find().then((recipes)=>{
		res.status(200).json(recipes);
	}).catch((error)=>{
		res.status(400).json({error})
	})
	
});

module.exports = app;