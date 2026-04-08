import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  // Add product to cart with quantity tracking
  addToProduct() {
    let cartItems = getLocalStorage("so-cart") || [];

    const existing = cartItems.find((p) => p.Id === this.product.Id);

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      this.product.quantity = 1;
      cartItems.push(this.product);
    }

    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    document.querySelector("main").innerHTML = productDetailsTemplate(this.product);
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToProduct.bind(this));
  }
}

// Template for product details page
function productDetailsTemplate(product) {
  return `<section class="product-detail">
    <h3>${product.Brand?.Name || product.Brand}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${product.Image}"
      alt="${product.NameWithoutBrand}"
    />
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors?.[0]?.ColorName || ""}</p>
    <p class="product__description">
      ${product.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  </section>`;
}
