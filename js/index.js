import {
  getListProduct,
  createProduct,
  deleteProduct,
} from "../service/callApi.js";
// declare
let productList = [];
let cardList = [];
let productTemp;
// setup
(function setUp() {
  getListProduct()
    .then(function (res) {
      productList = res.data;
      saveLocalStorage("productList", productList);
      renderListProduct(productList);
      renderListProductForAdmin(productList);
    })
    .catch(function (err) {
      console.log(err);
    });
})();

// LocalStorage
function saveLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function getLocalStorage(key) {
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key));
  } else {
    return;
  }
}

// render
function renderListProduct(list) {
  let content = "";
  list.map((item, index) => {
    content += `<div class="col-3 my-2">
        <div class="card text-left">
          <img
            class="card-img-top"
            src=${item.image}
            alt=""
          />
          <div class="card-body">
            <h4 class="card-title">${item.name}</h4>
            <p class="card-text">${item.price}</p>
            <p class="card-text">${item.type}</p>
          </div>
          <div class="card-footer">
            <button class="btn btn-success" onclick="handleAddToCard(${item.id})">Add To Card</button>
          </div>
        </div>
      </div>
      `;
  });
  document.getElementById("productList").innerHTML = content;
}
function renderListCard(list) {
  let content = "";
  list.map((item, index) => {
    content += `<tr>
    <td>
      <img
        style="width: 200px;"
        class="img-thumbnail"
        src=${item.image}
        alt=""
      />
    </td>
    <td>${item.name}</td>
    <td>${item.price}$</td>
    <td class="d-flex justify-content-between align-items-center">
      <button class="btn btn-outline-info" onclick="incrementQuantity(${item.id})">+</button>
      <p>${item.quantity}</p>
      <button class="btn btn-outline-info" onclick="decrementQuantity(${item.id})">-</button>
    </td>
    <td>
        <button class="btn btn-outline-danger" onclick="handleDelete(${item.id})">X</button>
    </td>
  </tr>`;
  });
  document.getElementById("cardList").innerHTML = content;
}
function renderListProductForAdmin(list) {
  let content = "";
  list.map((item, index) => {
    content += `
    <tr>
    <th>
      <img
        style="width: 200px;"
        class="img-thumbnail"
        src=${item.image}
        alt=""
      />
    </th>
    <td>${item.name}</td>
    <td>${item.description}</td>
    <td>${item.price}</td>
    <td>${item.inventory}</td>
    <td>${item.rating}</td>
    <td>${item.type}</td>
    <td>
      <button class="btn btn-danger" onclick="handleRemoveProduct(${item.id})">
        <i class="fa fa-trash-alt"></i>
      </button>
      <button class="btn btn-info">
        <i class="fa fa-pencil-alt"></i>
      </button>
    </td>
  </tr>
    `;
  });
  document.getElementById("productListForAdmin").innerHTML = content;
}

// handle event
window.handleAddToCard = handleAddToCard;
function handleAddToCard(id) {
  let newCard;
  const card = productList.find(function (product) {
    return product.id == id;
  });
  const isExist = cardList.findIndex(function (card) {
    return card.id == id;
  });
  if (isExist >= 0) {
    cardList[isExist].quantity++;
  } else {
    newCard = { ...card, quantity: 1 };
    cardList.push(newCard);
  }
  renderListCard(cardList);
  saveLocalStorage("cardList", cardList);
}
document.getElementById("proName").addEventListener("change", function (e) {
  let productTemp;
  if (e.target.value == "asc") {
    productTemp = productList.sort(function (a, b) {
      const nameA = a.name.trim().toLowerCase();
      const nameB = b.name.trim().toLowerCase();
      if (nameA > nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }
      return 0;
    });
  } else if (e.target.value == "desc") {
    productTemp = productList.sort(function (a, b) {
      const nameA = a.name.trim().toLowerCase();
      const nameB = b.name.trim().toLowerCase();
      if (nameA > nameB) {
        return 1;
      }
      if (nameA < nameB) {
        return -1;
      }
      return 0;
    });
  } else {
    return;
  }
  console.log(productTemp);
  renderListProduct(productTemp);
});

document.getElementById("proType").addEventListener("change", function (e) {
  let productTemp = productList.filter(function (product) {
    return product.type === e.target.value;
  });
  renderListProduct(productTemp);
});
window.incrementQuantity = incrementQuantity;
function incrementQuantity(id) {
  const isExist = cardList.findIndex(function (product) {
    return product.id == id;
  });
  cardList[isExist].quantity++;
  renderListCard(cardList);
}
window.decrementQuantity = decrementQuantity;
function decrementQuantity(id) {
  const isExist = cardList.findIndex(function (product) {
    return product.id == id;
  });
  if (cardList[isExist].quantity > 0) cardList[isExist].quantity--;
  renderListCard(cardList);
}
window.handleDelete = handleDelete;
function handleDelete(id) {
  const isExist = cardList.findIndex(function (product) {
    return product.id == id;
  });
  cardList.splice(isExist, 1);
  renderListCard(cardList);
}

document
  .getElementById("submitProduct")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("productName").value;
    const image = document.getElementById("productImage").value;
    const price = document.getElementById("productPrice").value;
    const inventory = document.getElementById("productInventory").value;
    const rating = document.getElementById("productRating").value;
    const type = document.getElementById("productType").value;
    const newProduct = {
      name,
      image,
      price,
      inventory,
      rating,
      type,
    };
    createProduct(newProduct)
      .then(function (res) {
        setUp();
        renderListProductForAdmin(productList);
      })
      .catch(function (err) {
        console.log(err);
      });
  });

window.handleRemoveProduct = handleRemoveProduct;
function handleRemoveProduct(id) {
  deleteProduct(id)
    .then(function (res) {
      console.log(res);
      getListProduct()
        .then(function (res) {
          productList = res.data;
          saveLocalStorage("productList", productList);
          renderListProduct(productList);
          renderListProductForAdmin(productList);
        })
        .catch(function (err) {
          console.log(err);
        });
    })
    .catch(function (err) {
      console.log(err);
    });
}
