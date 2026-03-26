document.addEventListener('DOMContentLoaded', () => {
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  const userList = document.querySelector('.user-list');
  const portfolioDetails = document.querySelector('.portfolio-list');
  const saveButton = document.querySelector('#btnSave');
  const deleteButton = document.querySelector('#btnDelete');

  generateUserList(userData);
  clearPortfolio();
  clearStockDetails();

  userList.addEventListener('click', (event) => {
    handleUserListClick(event, userData, stocksData);
  });

  portfolioDetails.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      viewStock(event.target.id, stocksData);
    }
  });

  saveButton.addEventListener('click', (event) => {
    event.preventDefault();

    const id = document.querySelector('#userID').value;
    const user = userData.find((u) => u.id == id);

    if (!user) return;

    user.user.firstname = document.querySelector('#firstname').value;
    user.user.lastname = document.querySelector('#lastname').value;
    user.user.address = document.querySelector('#address').value;
    user.user.city = document.querySelector('#city').value;
    user.user.email = document.querySelector('#email').value;

    generateUserList(userData);
    populateForm(user);
    renderPortfolio(user, stocksData);
  });

  deleteButton.addEventListener('click', (event) => {
    event.preventDefault();

    const id = document.querySelector('#userID').value;
    const userIndex = userData.findIndex((u) => u.id == id);

    if (userIndex === -1) return;

    userData.splice(userIndex, 1);

    generateUserList(userData);
    clearForm();
    clearPortfolio();
    clearStockDetails();
  });
});

/**
 * Loops through the users and renders a ul with li elements for each user
 * @param {*} users
 */
function generateUserList(users) {
  const userList = document.querySelector('.user-list');
  userList.innerHTML = '';

  users.map(({ user, id }) => {
    const listItem = document.createElement('li');
    listItem.innerText = `${user.lastname}, ${user.firstname}`;
    listItem.setAttribute('id', id);
    userList.appendChild(listItem);
  });
}

/**
 * Handles the click event on the user list
 * @param {*} event
 */
function handleUserListClick(event, users, stocks) {
  const listItem = event.target.closest('li');
  if (!listItem) return;

  const userId = listItem.id;
  const user = users.find((u) => u.id == userId);
  if (!user) return;

  populateForm(user);
  renderPortfolio(user, stocks);
}

/**
 * Populates the form with the user's data
 * @param {*} data
 */
function populateForm(data) {
  const { user, id } = data;

  document.querySelector('#userID').value = id;
  document.querySelector('#firstname').value = user.firstname;
  document.querySelector('#lastname').value = user.lastname;
  document.querySelector('#address').value = user.address;
  document.querySelector('#city').value = user.city;
  document.querySelector('#email').value = user.email;
}

/**
 * Renders the portfolio items for the user
 * @param {*} user
 */
function renderPortfolio(user, stocks) {
  const { portfolio } = user;
  const portfolioDetails = document.querySelector('.portfolio-list');

  portfolioDetails.innerHTML = `
    <h3>Symbol</h3>
    <h3># Shares</h3>
    <h3>Actions</h3>
  `;

  portfolio.map(({ symbol, owned }) => {
    const symbolEl = document.createElement('p');
    const sharesEl = document.createElement('p');
    const actionEl = document.createElement('button');

    symbolEl.innerText = symbol;
    sharesEl.innerText = owned;
    actionEl.innerText = 'View';
    actionEl.setAttribute('id', symbol);

    portfolioDetails.appendChild(symbolEl);
    portfolioDetails.appendChild(sharesEl);
    portfolioDetails.appendChild(actionEl);
  });
}

/**
 * Renders the stock information for the symbol
 * @param {*} symbol
 */
function viewStock(symbol, stocks) {
  const stockArea = document.querySelector('.stock-form');
  if (!stockArea) return;

  const stock = stocks.find((s) => s.symbol == symbol);
  if (!stock) return;

  document.querySelector('#stockName').textContent = stock.name;
  document.querySelector('#stockSector').textContent = stock.sector;
  document.querySelector('#stockIndustry').textContent = stock.subIndustry;
  document.querySelector('#stockAddress').textContent = stock.address;

  const logo = document.querySelector('#logo');
  logo.src = `logos/${symbol}.svg`;
  logo.alt = `${stock.name} logo`;
}

function clearForm() {
  document.querySelector('#userID').value = '';
  document.querySelector('#firstname').value = '';
  document.querySelector('#lastname').value = '';
  document.querySelector('#address').value = '';
  document.querySelector('#city').value = '';
  document.querySelector('#email').value = '';
}

function clearPortfolio() {
  const portfolioDetails = document.querySelector('.portfolio-list');
  portfolioDetails.innerHTML = `
    <h3>Symbol</h3>
    <h3># Shares</h3>
    <h3>Actions</h3>
  `;
}

function clearStockDetails() {
  document.querySelector('#stockName').textContent = '';
  document.querySelector('#stockSector').textContent = '';
  document.querySelector('#stockIndustry').textContent = '';
  document.querySelector('#stockAddress').textContent = '';

  const logo = document.querySelector('#logo');
  logo.removeAttribute('src');
  logo.alt = '';
}