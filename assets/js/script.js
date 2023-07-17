let show_sizes_array = []; // Array for filtered sizes
let show_colors_array = []; // Array for filtered colors
let show_genders_array = []; // Array for filtered genders
let show_styles_array = []; // Array for filtered styles
let priceSlider; // Reference to the ion.rangeSlider instance

$(document).ready(function () {
  showAllItems(); // Display all items with no filter applied

  $(
    ".size-filter-check, .color-filter-check, .gender-filter-check, .style-filter-check"
  ).change(function () {
    // When a checkbox is changed
    let size_clicked = $(this).attr("data-size");
    let color_clicked = $(this).attr("data-color");
    let gender_clicked = $(this).attr("data-gender");
    let style_clicked = $(this).attr("data-style");

    if ($(this).is(":checked")) {
      if (size_clicked) show_sizes_array.push(size_clicked);
      if (color_clicked) show_colors_array.push(color_clicked);
      if (gender_clicked) show_genders_array.push(gender_clicked);
      if (style_clicked) show_styles_array.push(style_clicked);
    } else {
      if (size_clicked)
        show_sizes_array = show_sizes_array.filter(function (elem) {
          return elem !== size_clicked;
        });
      if (color_clicked)
        show_colors_array = show_colors_array.filter(function (elem) {
          return elem !== color_clicked;
        });
      if (gender_clicked)
        show_genders_array = show_genders_array.filter(function (elem) {
          return elem !== gender_clicked;
        });
      if (style_clicked)
        show_styles_array = show_styles_array.filter(function (elem) {
          return elem !== style_clicked;
        });
    }

    showItemsFiltered(); // Show items grid with filters

    if (!$("input[type=checkbox]").is(":checked")) {
      // No checkboxes are checked
      show_sizes_array = []; // Clear size filter array
      show_colors_array = []; // Clear color filter array
      show_genders_array = []; // Clear gender filter array
      show_styles_array = []; // Clear style filter array
      showAllItems(); // Show all items with no filters applied
    }
  });

  // Initialize the range slider
  priceSlider = $("#rangeSlider").ionRangeSlider({
    type: "double",
    grid: true,
    min: 0,
    max: 100,
    from: 20,
    to: 80,
    step: 1,
    onFinish: function (data) {
      // Trigger filtering when the range slider values change
      showItemsFiltered(data.from, data.to); // Pass the values to the function
    },
  });
});

function showAllItems() {
  fetch("shoes.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let shoes = data.shoes;
      $("#display-items-div").empty();
      for (let i = 0; i < shoes.length; i++) {
        let item_content =
          '<div class="col-12 col-md-4 text-center product-card" data-available-sizes="' +
          shoes[i]["sizes"] +
          '" data-color="' +
          shoes[i]["colour"] +
          '" data-gender="' +
          shoes[i]["gender"] +
          '" data-style="' +
          shoes[i]["style"] +
          '">' +
          '<div class="position-relative"> <img src="' +
          shoes[i]["picture"] +
          '" height="250" width="100%" alt="shoe thumbnail"> <span class="position-absolute top-0 start-0 bg-dark text-white px-2 py-1">New</span> </div> <div class=" d-flex justify-content-between p-2 align-items-center"> <p class="text-start p-2">' +
          shoes[i]["name"] +
          "</p> <p class='lead p-2 bg-dark rounded-circle text-white '>$" +
          shoes[i]["price"] +
          "</p> </div> <p class='sizes  text-start p-2 lead' > Sizes : " +
          shoes[i]["sizes"] +
          " </p>  <p class='colour text-start p-2 lead'> Color : " +
          shoes[i]["colour"] +
          "   </p> <p class='item_id' hidden >  " +
          shoes[i]["id"] +
          " </p>  </div>";
        $("#display-items-div").append(item_content);
      }
      $(".product-card").on("click", function () {
        // alert($("#ppppppp").text())
        let id = $(this).children(".item_id").text();

        url = "product.html?id=" + encodeURIComponent(id);

        document.location.href = url;
      });
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
}

function showItemsFiltered(fromValue, toValue) {
  const minValue = parseFloat(fromValue);
  const maxValue = parseFloat(toValue);
  fetch("shoes.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let shoes = data.shoes;

      $("#display-items-div").empty(); // Clear the container before appending filtered items
      for (let i = 0; i < shoes.length; i++) {
        let sizes = shoes[i]["sizes"].map((size) => size.toString());
        let price = parseFloat(shoes[i]["price"]);
        console.log("min", fromValue, "max", toValue);
        if (
          (show_sizes_array.length === 0 ||
            show_sizes_array.every((v) => sizes.includes(v))) &&
          (show_colors_array.length === 0 ||
            show_colors_array.includes(shoes[i]["colour"])) &&
          (show_genders_array.length === 0 ||
            show_genders_array.includes(shoes[i]["gender"])) &&
          (show_styles_array.length === 0 ||
            show_styles_array.includes(shoes[i]["style"])) &&
          (isNaN(minValue) || price >= minValue) && // Check if price is greater than or equal to minValue
          (isNaN(maxValue) || price <= maxValue) // Check if price is less than or equal to maxValue
        ) {
          let item_content =
            '<div class="col-12 col-md-4 text-center product-card" data-available-sizes="' +
            shoes[i]["sizes"] +
            '" data-color="' +
            shoes[i]["colour"] +
            '" data-gender="' +
            shoes[i]["gender"] +
            '" data-style="' +
            shoes[i]["style"] +
            '">' +
            '<div class="position-relative"> <img src="' +
            shoes[i]["picture"] +
            '" height="250" width="100%" alt="shoe thumbnail"> <span class="position-absolute top-0 start-0 bg-dark text-white px-2 py-1">New</span> </div> <div class=" d-flex justify-content-between p-2 align-items-center"> <p class="text-start p-2">' +
            shoes[i]["name"] +
            "</p> <p class='lead p-2 bg-dark rounded-circle text-white '>$" +
            shoes[i]["price"] +
            "</p> </div> <p class='sizes  text-start p-2 lead' > Sizes : " +
            shoes[i]["sizes"] +
            " </p>  <p class='colour text-start p-2 lead'> Color : " +
            shoes[i]["colour"] +
            "   </p> <p class='item_id' hidden >  " +
            shoes[i]["id"] +
            " </p>  </div>";
          $("#display-items-div").append(item_content);
        }
        $(".product-card").on("click", function () {
          // alert($("#ppppppp").text())
          let id = $(this).children(".item_id").text();

          url = "product.html?id=" + encodeURIComponent(id);

          document.location.href = url;
        });
      }
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
}

if (window.location.href.match("product.html") != null) {
  var url = document.location.href,
    params = url.split("?")[1].split("&"),
    data = {},
    tmp;
  for (var i = 0, l = params.length; i < l; i++) {
    tmp = params[i].split("=");
    data[tmp[0]] = tmp[1];
  }

  var productId = decodeURIComponent(data.id);

  fetch("shoes.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var shoes = data.shoes;

      // Find the product with the matching ID
      var product = shoes.find(function (shoe) {
        console.log(productId);
        return shoe.id.trim() === productId.trim();
      });

      if (product) {
        var productIdElement = document.querySelector(".product-id");
        var productNameElement = document.querySelector(".product-name");
        var productDescriptionElement = document.querySelector(".content p");
        var productDescriptionsElement =
          document.querySelector(".p_description");
        var productPriceElement = document.querySelector(".right-side .price");
        var productColorElement = document.querySelector(".colors .color");
        var productSizeElement = document.querySelector(".sizes .size");
        var productGenderElement = document.querySelector(".gender");
        var productStyleElement = document.querySelector(".style");
        var productMainImageElement = document.querySelector(".main_image img");
        var productThumbnailImage1Element = document.querySelector(
          ".thumbnail_image1 img"
        );
        var productThumbnailImage2Element = document.querySelector(
          ".thumbnail_image2 img"
        );
        var productThumbnailImage3Element = document.querySelector(
          ".thumbnail_image3 img"
        );
        var productThumbnailImage4Element = document.querySelector(
          ".thumbnail_image4 img"
        );
        productIdElement.innerText = product.id;
        productNameElement.innerText = product.name;
        productDescriptionElement.innerText = product.description;
        productDescriptionsElement.innerText = product.description;
        productPriceElement.innerText = "$" + product.price.toFixed(2);
        productColorElement.style.backgroundColor = product.colour;
        productGenderElement.innerText = product.gender;
        productStyleElement.innerText = product.style;
        productMainImageElement.src = product.picture;
        productThumbnailImage1Element.src = product.picture1;
        productThumbnailImage2Element.src = product.picture2;
        productThumbnailImage3Element.src = product.picture3;
        productThumbnailImage4Element.src = product.picture4;

        // for sizes
        var sizes = product.sizes;

        productSizeElement.innerHTML = "";

     
        sizes.forEach(function (size) {
          var liElement = document.createElement("li");
          liElement.innerText = size;

        
          liElement.classList.add("list-group-item", "border-1", "me-1", "p-3", "rounded-3"  , "text-dark" ,"bg-light");

          productSizeElement.appendChild(liElement);
        });
        // for heart icon
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        console.log("fav", favorites);
        const existingProduct = favorites.find(
          (item) => item.id === productIdElement.innerText
        );

        const heartIcon = document.createElement("span");
        heartIcon.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="text-danger" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
        </svg>
          `;

        const heartContainer = document.querySelector(".heart");
        heartContainer.innerHTML = "";

        if (existingProduct) {
          console.log("prod", existingProduct);
          heartContainer.appendChild(heartIcon);
        } else {
          const emptyHeartIcon = document.createElement("span");
          emptyHeartIcon.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-suit-heart" viewBox="0 0 16 16">
          <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>
        </svg>
          `;
          heartContainer.appendChild(emptyHeartIcon);
        }
      } else {
        console.log("Product not found");
      }
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
}

// for changing images
function changeImage(element) {
  var main_prodcut_image = document.getElementById("main_product_image");
  main_prodcut_image.src = element.src;
}

// for favourties

document
  .getElementById("main_product_image")
  .addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text/plain", event.target.src);
  });

document
  .getElementById("add-to-favorites")
  .addEventListener("dragover", function (event) {
    event.preventDefault();
  });

function addToFavorites(productId) {
  fetch("shoes.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const product = data.shoes.find((item) => item.id === productId);

      if (product) {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        const existingProduct = favorites.find((item) => item.id === productId);
        console.log(favorites);
        if (!existingProduct) {
          favorites.push(product);
          localStorage.setItem("favorites", JSON.stringify(favorites));
          console.log("Product added to favorites!");
          location.reload();
        } else {
          alert("Product is already in favorites!");
        }
      }
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
}
// for image drag and drop

document
  .getElementById("add-to-favorites")
  .addEventListener("drop", function (event) {
    event.preventDefault();
    const productId = document.querySelector(".product-id").innerText;
    addToFavorites(productId);
  });

// on button click
document
  .getElementById("add-to-favorites")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const productId = document.querySelector(".product-id").innerText;
    addToFavorites(productId);
  });

// show fav list
function generateFavoriteProductHTML(product) {
  return `
  <div class="favorite-product col-12 col-md-4 text-center product-card" data-product-id="${product.id}">
  <img src="${product.picture}" width="100%" height="250px" draggable="true" alt="Product Image">
  <h3 class="text-start p-2">${product.name}</h3>
  <h3 class="text-start lead p-2">Sizes : ${product.sizes}</h3>
  <p class="text-start lead p-2"> Price : ${product.price}</p>
  <button class="btn btn-danger mb-2 remove-from-favorites"   type="button">Remove From Favorites </button>
</div>

  `;
}

function displayFavoriteProducts() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favoriteProductsContainer =
    document.getElementById("display-items-divs");

  favoriteProductsContainer.innerHTML = "";

  favorites.forEach(function (product) {
    const favoriteProductHTML = generateFavoriteProductHTML(product);
    favoriteProductsContainer.innerHTML += favoriteProductHTML;
  });
}

$("#productList").on("show.bs.modal", function (event) {
  displayFavoriteProducts();
});

// for image drag and drop
$(document).on("click", ".remove-from-favorites", function () {
  const productId = $(this).closest(".favorite-product").data("product-id");
  removeProductFromFavorites(productId);
});

$(document).on("dragstart", ".favorite-product img", function (event) {
  event.originalEvent.dataTransfer.setData(
    "text/plain",
    $(this).closest(".favorite-product").data("product-id")
  );
});

// Add dragover event listener to the remove button
$(document).on("dragover", ".remove-from-favorites", function (event) {
  event.preventDefault();
});

// Add drop event listener to the remove button
$(document).on("drop", ".remove-from-favorites", function (event) {
  event.preventDefault();
  const productId = event.originalEvent.dataTransfer.getData("text/plain");
  removeProductFromFavorites(productId);
});

function removeProductFromFavorites(productId) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.findIndex((item) => item.id == productId);

  if (index !== -1) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));

    displayFavoriteProducts();

    console.log("Product removed from favorites!");
  }
}

$(".btn-modal").on("click", function () {
  location.reload();
});
