import ProductData from "./ProductData.mjs";
import { qs } from "./utils.mjs";

const dataSource = new ProductData("tents"); // adjust category if needed

function initSearch() {
  const form = qs("#searchForm");
  const input = qs("#searchInput");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim().toLowerCase();

    // Debug: check if products are loading
    const products = await dataSource.getData();
    console.log("Loaded products:", products);
    console.log("Search query:", query);

    const results = products.filter(
      (p) =>
        p.Name.toLowerCase().includes(query) ||
        (p.Brand.Name && p.Brand.Name.toLowerCase().includes(query)),
    );

    renderSearchResults(results);
  });
}

function renderSearchResults(results) {
  const list = qs(".product-list");
  list.innerHTML = "";

  if (results.length === 0) {
    list.innerHTML = "<li>No results found</li>";
    return;
  }

  const htmlItems = results.map((item) => productTemplate(item));
  list.innerHTML = htmlItems.join("");
}

function productTemplate(item) {
  return `<li class="product-card">
    <a href="product_pages/${item.Id}.html">
      <img src="${item.Image}" alt="${item.Name}" />
      <h3 class="card__brand">${item.Brand.Name}</h3>
      <h2 class="card__name">${item.Name}</h2>
      <p class="product-card__price">$${item.FinalPrice}</p>
    </a>
  </li>`;
}

initSearch();
