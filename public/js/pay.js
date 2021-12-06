let productList = [];
let carrito = [];
let total = 0;

function add(productId, price) {
  const product = productList.find(p => p.id === productId);
  product.stock--;


  console.log(productId, price);
  carrito.push(productId);
  total = total + price;
  document.getElementById("checkout").innerHTML = `Pagar $${total}`
  displayProducts();
}

async function pay() {
  try {
    const productList = await (await fetch('/api/pay', {
      method: "post",
      body: JSON.stringify(carrito),
      headers: {
        "Content-Type": "application/json"
      }
    })).json();

  }
  catch {
    window.alert("Sin stock");
  }

  carrito = [];
  total = 0;
  await fetchProducts();
  document.getElementById("checkout").innerHTML = `Pagar $${total}`
}





// -------
function displayProducts() {
  let productsHTML = '';
  productList.forEach(p => {
    let buttonHTML = `<button type="button" class="btn btn-dark botonadd" onclick="add(${p.id},${p.price})" >Añadir</button>`;

    if (p.stock <= 0) {
      buttonHTML = `<button type="button" class="btn btn-dark botonadd disabled" onclick="add(${p.id},${p.price})" >Sin Stock</button>`;
    }

    productsHTML +=
      `<div class="col" >
          <div class="card">
            <img src="${p.image}" class="card-img-top" alt="Lentes">
            <div class="card-body text-center">
              <h5 class="card-title">${p.name}</h5>
              <p class="card-text"><b>$${p.price}</b></p>
              ${buttonHTML}
            </div>
          </div>
        </div>`
  });
  document.getElementById('page-content').innerHTML = productsHTML;
}


async function fetchProducts() {
  productList = await (await fetch("/api/productos")).json();
  displayProducts();
}

window.onload = async () => {
  await fetchProducts();

}