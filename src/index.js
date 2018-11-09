document.addEventListener("DOMContentLoaded", ()=>{

const beerListCont = document.querySelector('.list-group');
const beerDetailCont = document.querySelector('#beer-detail');

class Adapter {
  static getListOfBeers(){
    return fetch('http://localhost:3000/beers')
      .then(res => res.json())
      .then(json => {
        renderBeerList(json)})
  }

  static getSingleBeer(id){
    return fetch(`http://localhost:3000/beers/${id}`)
      .then(res => res.json())
      .then(json => {
        moreDetails(json) })
  }

  static getBeerDetails(beerId){
    return fetch(`http://localhost:3000/beers/${beerId}`)
      .then(res => res.json())
      .then(json => renderBeerDetails(json))
  }

  static editBeer(id, value){
    return fetch(`http://localhost:3000/beers/${id}`,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        description: value
      })
    })
    .then(res => res.json())
    // .then(json => console.log(json))
  }

  static deleteBeer(id){
    return fetch(`http://localhost:3000/beers/${id}`,{
      method: "DELETE"})
  }
}

Adapter.getListOfBeers();

function renderBeerList(list){
  // debugger;
  for(beer of list){
    renderBeer(beer);
  }
}

function renderBeer(beer){
  let beerCont = document.createElement('li');
  beerCont.className = 'list-group-item';
  beerCont.dataset.id = `${beer.id}`
  beerCont.innerHTML = `${beer.name}`
  beerListCont.appendChild(beerCont);
}

function renderBeerDetails(beer){
  beerDetailCont.innerHTML = '';
  let beerDetail = document.createElement('div')
  beerDetail.className = "detail-box";
  beerDetail.dataset.id = `${beer.id}`
  beerDetail.innerHTML = `<h1>${beer.name}</h1><br>
<img src="${beer.image_url}">
<h3>${beer.tagline}</h3>
<a href="#" id="add-details"><small>More...</small></a><br><br>
<div id="more-details-box"></div>
<textarea style="max-width:350px;min-height:100px">${beer.description}</textarea><br><br>
<button id="edit-beer" class="btn btn-info">
  Save
</button>
<button id="delete-beer" class="btn btn-info">
  Delete
</button>
`
  beerDetailCont.appendChild(beerDetail);
}

function moreDetails(beer){
  const moreDetailsBox = document.querySelector("#more-details-box")
  if(beerDetailCont.className.includes("more-toggle")){
    moreDetailsBox.innerHTML = "";
    beerDetailCont.className = "";
  } else {
    beerDetailCont.className = "more-toggle";
    moreDetailsBox.innerHTML = `<small><p>First Brew Date: ${beer.first_brewed}</p>
    <p>Tips for the Brewer: ${beer.brewers_tips}</p>
    <ul>Food pairing:`;
    for (pairing of beer.food_pairing){
      moreDetailsBox.innerHTML += `<li>${pairing}</li>`
    }
    moreDetailsBox.innerHTML += `</ul></small><br><br>`
  }
}

document.addEventListener("click", function(event){
  if(event.target.className == "list-group-item"){
    Adapter.getBeerDetails(event.target.dataset.id)
  }
  if(event.target.id == "edit-beer"){
    let beerId = event.target.parentElement.dataset.id
    let editValue = event.target.parentElement.querySelector("textarea").value
    Adapter.editBeer(beerId, editValue);
  }
  if(event.target.id == "delete-beer"){
    let beerId = event.target.parentElement.dataset.id
    event.target.parentElement.remove();
    document.querySelector(`li[data-id="${beerId}"]`).remove();
    Adapter.deleteBeer(beerId);
  }
  if(event.target.innerText == "More..."){
    // debugger;
    let beerId = event.target.parentElement.parentElement.dataset.id
    Adapter.getSingleBeer(beerId);
  }
})


})
