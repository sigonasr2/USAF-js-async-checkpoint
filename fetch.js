const fetch = require('node-fetch');
const fs = require('fs');

var pokeData = []
var pokemonCount = 0

var pokeNames = "";


var getPokemonCount = (url) => {
	return fetch(url).then(response => response.json())
	.then(data => {
		pokemonCount = data.count;
	})
}

var getPokemon = (url) => {
	return fetch(url).then(response => response.json())
	.then(data => {
		data.results.forEach(pokemon=>{pokeData.push(pokemon)})
	})
}

var getPokemonData = (url) => {
	return fetch(url).then(response => response.json())
	.then(data => {
		//console.log(data.types)
		return data.types
	})
}

//fs.open('pokemon.txt', 'w',(err)=>{if(err) console.log('error', err);});

var requests = getPokemonCount("https://pokeapi.co/api/v2/pokemon")
.then((result)=>{
	return getPokemon("https://pokeapi.co/api/v2/pokemon?limit="+pokemonCount)
})
.then((result)=>{
	var fileText = "";
	pokeData.forEach(data=>{
		  fileText+=data.name+"\n";
		  //fs.open('pokemon.txt', 'w',(err)=>{if(err) console.log('error', err);});
	})
	fs.writeFileSync("pokemon.txt",fileText,(err)=>{if(err) console.log('error', err);});
	var data = fs.readFileSync("pokemon.txt",(err)=>{if(err) console.log('error', err);})
	data.toString().split("\n").forEach((name)=>{
		getPokemonData("https://pokeapi.co/api/v2/pokemon/"+name).then((data)=>{
			var typeString="";
			data.forEach((type,count)=>{
				if (count!==0) {
					typeString+=", "
				}
				typeString+=type.type.name
			})
			console.log(name+": "+typeString)
		})
	})
})

