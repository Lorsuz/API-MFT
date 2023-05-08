function getProductView(card) {
  return `<div class="card">
  <div class="box-img">
    <div class="img"><img src="components/images/image-news/${card.image}.png" target="_blank" alt="">
  </div>
  <span class="date">${card.date}</span>
</div>
  <div class="text">
    <h3>${card.title}</h3>
    <p>${card.description}</p>
    <div class="more"><a href="${card.link}" target="_blank"><span>Ler mais</span> <i class="fa-solid fa-arrow-right"></i></a></div>
  </div>
</div>`;

}

const response = await fetch('./../jsons/data.json');
const data = await response.json();

let productsView = '';
for (const card of data.news) {
  productsView += getProductView(card);
}

productsView;

document.querySelector('#cardNews').innerHTML = productsView;



function searchProducts(query) {
 const filteredProducts = data.news.filter(card =>
    card.title.toLowerCase().includes(query.toLowerCase())
  );
  return filteredProducts;
}

function displayProducts(products) {
  const productsView = products.map(getProductView).join('');
  if (products.length == 0) {
    document.querySelector('#cardNews').innerHTML=`<p>Nenhuma Noticia encontrada!!</p>`
  }else{
    document.querySelector('#cardNews').innerHTML = productsView;
  }
}

//  DISPLAY THE PRODUCTS
displayProducts(data.news);

// ESCUTAR FORM E PROCURAR
document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();
  const query = document.querySelector('#search-box').value;
  const filteredProducts = searchProducts(query);
  
  displayProducts(filteredProducts);


});

