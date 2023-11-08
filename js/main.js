const imgDiv = document.querySelector(".img");
const nameCard = document.querySelector(".name");
const btnCatch = document.querySelector(".catch");
const btnSearchPokemon = document.querySelector(".search_pokemon");
const mainHtml = document.querySelector(".main");
const pokemonCatched = document.querySelector(".pokemon_catched");
const mainCatched = document.querySelector(".main_catched");
const btnShowCatched = document.querySelector(".show_catched");
const containerCatched = document.querySelector(".container-catched");
let URL = "https://pokeapi.co/api/v2/pokemon/";

//variables globales

let captured = [];
let pokemonID;



const checkCantStorage = () => {
    if(localStorage.getItem("cant")===null){
        return 0
    }else {
        return Number(localStorage.getItem("cant"))}
}

const deleteAll = () => {
    const pokemonCard = document.querySelectorAll(".pokemon_card");
    for (let div of pokemonCard) {
        div.remove();        
    }
}


const whichDelete = (id) => {
    const pokemonCaptured = JSON.parse(localStorage.getItem(`pokemonid`))  
    for ( let i = 0; i < pokemonCaptured.length ; i++) {                
        if(pokemonCaptured[i].pokemonID === id) {            
            pokemonCaptured.splice(i, 1);
            const jsonCaptured = JSON.stringify(pokemonCaptured);
            localStorage.setItem("pokemonid", jsonCaptured);
        } 
    }
} 

//Creacion de cartas de pokemon atrapados tambien con la logica de los botones creados.

const createCardsCatched = (pokemonData) => {
    
    const cards = document.createElement("div");    
    const img = document.createElement("img");
    const buttonDelete = document.createElement("button");
    const p = document.createElement("p");
    buttonDelete.innerText = "Liberar";    
    buttonDelete.addEventListener("click", () => {
        localStorage.setItem("cant", checkCantStorage() - 1)                 
        whichDelete(pokemonData.id);
        printCatched();
    })                
    p.innerHTML = `${pokemonData.name}`;                
    cards.className = "pokemon_card";
    img.src = pokemonData.sprites.other["official-artwork"].front_default;
    cards.appendChild(p);
    cards.appendChild(img);
    cards.appendChild(buttonDelete);
    containerCatched.appendChild(cards);
}


const printCatched = () => {       
    deleteAll();
    const pokemonCaptured = JSON.parse(localStorage.getItem(`pokemonid`));
    if(pokemonCaptured != null) {
        for(let i = 0; i < 6; i++) {               
            fetch(URL + pokemonCaptured[i]?.pokemonID || null)
                .then(res => res.json())
                .then(data => {                
                        const pokemonData = data;
                        createCardsCatched(pokemonData);
                    })
                .catch(e => console.error(new Error(e)))                    
        }
    }    
}

/// Primer chequeo si es el primer ingreso y los storage estan vacios.

const checkFirstTime = () => {
    const checkQuantity = JSON.parse(localStorage.getItem("cant"));
    const checkPokemonid = JSON.parse(localStorage.getItem("pokemonid"));
    console.log(checkPokemonid);
    if(checkQuantity != undefined){
        printCatched();
    } else if(checkPokemonid === null ) {
        localStorage.setItem("cant", checkCantStorage() );
        printCatched();
    }
}

checkFirstTime();


const printPokemon = (id) => {
    fetch(URL + id)
        .then(res => res.json())
        .then(data => { 
            const pokemon = data;                                               
            nameCard.innerText = `${pokemon.name}`;
            imgDiv.src = pokemon.sprites.other["official-artwork"].front_default;            
        })
        .catch(e => console.error(new Error(e)))    
}

const randomId = (max) => {
    return Math.floor(Math.random() * max);
}
 
btnSearchPokemon.addEventListener("click", () => {
    pokemonID = randomId(1010);
    printPokemon(pokemonID);    
})

btnCatch.addEventListener("click", () => {
    checkCant();        
});    


const checkCant = () => {
    if(checkCantStorage() === 6) {
        btnCatch.disabled = true;
        alert(`Ya capturaste el maximo posible!
        Libera algun pokemon para seguir capturando.`);
    } else if (checkCantStorage() != 0){                
        btnCatch.disabled = false;
        captured = JSON.parse(localStorage.getItem(`pokemonid`));
        
        captured.push({pokemonID});               
        const jsonCaptured = JSON.stringify(captured);
        localStorage.setItem("pokemonid", jsonCaptured);
        localStorage.setItem("cant", checkCantStorage() + 1 );                    
               
    } else {
        btnCatch.disabled = false;
        localStorage.setItem("pokemonid", 0);                
        captured.push({pokemonID});               
        const jsonCaptured = JSON.stringify(captured);
        localStorage.setItem("pokemonid", jsonCaptured);
        localStorage.setItem("cant", checkCantStorage() + 1 );        
    }
}


