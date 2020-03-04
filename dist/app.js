{
    const shoppingIcon = document.querySelector('.nav__right--cart');
    const shoppingCart = document.querySelector('.shopping-cart');


    shoppingIcon.addEventListener('click', (e) => {

        shoppingCart.classList.toggle('none');

    });

    shoppingCart.addEventListener('click', (e) => {
        if (e.target.classList.contains('shopping-cart__btnX')) {
            shoppingCart.classList.add('none');
        }
    });

}




/*
    * =================== CART CONTROLLER ===================
*/
const CartController = (function () {
    let data = {
        cart: [],
        totalSum: 0

    }

    // Add item to Local Storage
    addItemToLS = function (cart) {
        let items;
        if (localStorage.getItem('cart') === null) {
            items = [];
        } else {
            items = JSON.parse(localStorage.getItem('cart'));
        }


        localStorage.setItem('cart', JSON.stringify([...items, cart]));
    }

    // Get Items from Local Storage
    getItemsFromLS = function () {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }

    // Save total sum in LS
    saveTotalSumInLS = function (tempSum) {
        let sum;
        if (localStorage.getItem('totalSum') === null) {
            sum = []
        } else {
            sum = JSON.parse(localStorage.getItem('totalSum'));
        }

        // add all prices to Local Storage
        localStorage.setItem('totalSum', JSON.stringify([...sum, tempSum]));
    }

    // Calculate total sum
    calculateTotal = function () {
        let tempSum;

        tempSum = 0;

        data.cart.forEach((current) => {
            tempSum = current.price;
        });

        saveTotalSumInLS(tempSum);
    }

    return {
        getData: function () {
            return data;
        },

        addProduct: function (product) {
            data.cart.push(product);

            // calculate prices
            calculateTotal();

            // add item to local storage
            addItemToLS(product);

        },

        getDataFromLS() {
            return getItemsFromLS();
        },

        getTotalSum() {
            let totalSum = 0;
            let prices = localStorage.getItem('totalSum') ? JSON.parse(localStorage.getItem('totalSum')) : [];

            prices.map((price) => {
                totalSum += price;
            })

            return totalSum;
        },
        clearAllItems() {
            localStorage.clear();
            data.cart = [];
        },
        checkAddedItems(id) {
            let check = '';
            ids = this.getDataFromLS().map(current => current.id);

            if (ids.includes(id)) {
                check = true;
            } else {
                check = false;
            }

            return check;
        },
        removeItemById(id, price) {
            // get id of the product
            id = parseInt(id);
            // get the price of the product
            price = parseFloat(price);
            // get products from LS
            let products = this.getDataFromLS();
            //get prices from data
            let prices = JSON.parse(localStorage.getItem('totalSum'))

            prices.forEach(cur => {
                if (cur === price) {
                    let arrPrices = JSON.parse(localStorage.getItem('totalSum'));

                    arrPrices = arrPrices.filter(el => el !== price);

                    localStorage.setItem('totalSum', JSON.stringify(arrPrices));

                }
            })

            // console.log(prices, price);

            products = products.filter(product => product.id !== id);
            // add all prices to Local Storage
            localStorage.setItem('cart', JSON.stringify(products));

        },

        updateAmountAndPrice(id, newAmount, newPrice) {
            let products, prices, item, itemPrice;
            // get products from LS
            products = this.getDataFromLS();
            //get prices from data
            prices = JSON.parse(localStorage.getItem('totalSum'));

            // Find product by ID
            item = products.find(product => product.id === id);
            item.amount = newAmount;
            item.price = newPrice;

            // get all new prices of products
            itemPrices = products.map(current => {
                return current.price;
            })


            // save  data in Local Storage
            localStorage.setItem('cart', JSON.stringify(products));
            localStorage.setItem('totalSum', JSON.stringify(itemPrices));
        }


    }


})();

/*
    * =================== UI CONTROLLER ===================
*/
const UIController = (function () {

    const DOM = {
        card: '.card',
        btnAddCart: '.card__btnAdd',
        totalSum: '.nav__right--total',
        amountInput: '.card__amount',
        searchInput: '.searchBox__search',
        shoppingCartBox: '.shopping-cart__box',
        inputAmount: '.shopping-cart__box--input',
        cartContent: '.shopping-cart__products',
        paymentBtn: '.shopping-cart__box--paymentBtn'

    }



    return {
        getDomElements: () => {
            return DOM;
        },

        showItemsInCart(product) {
            let div;

            div = document.createElement('div');
            div.className = 'shopping-cart__box--product';

            div.innerHTML = `<p class="shopping-cart__box--name">${product.title}</p>

                    <input type="number" class="shopping-cart__box--input" value="${product.amount}" id="${product.id}">

                    <p class="shopping-cart__box--price" data-price="${product.orignalPrice}">Price: ${product.price}$</p>
                    <p class="shopping-cart__box--removeBtn" data-id="${product.id}">X</p>`;



            document.querySelector(DOM.cartContent).appendChild(div);
        },

        clearItemsFromUI() {
            document.querySelector(DOM.cartContent).innerHTML = '';
            document.querySelector(DOM.totalSum).innerHTML = '0.00$';
        },

        showTotalSum(sum) {
            if (sum !== undefined) {
                document.querySelector(DOM.totalSum).innerText = sum.toFixed(2) + '$';
            }

        },


    }

})();

/*
    * =================== CONTROLLER ===================
*/
const Controller = (function (CartCtrl, UICtrl) {

    // Get DOm elements
    const DOMstrings = UIController.getDomElements();
    // Get all products
    const products = CartCtrl.getData().cart;

    addItem = (e) => {
        let id, card, title, amount, img, price, orignalPrice, product, products, totalSum;

        // get card element
        card = e.target.parentElement.parentElement;

        // get id of the clicked card
        id = parseInt(e.target.parentElement.parentElement.id);

        // get children of the card
        cardChildren = card.children;

        for (let i = 0; i < cardChildren.length; i++) {
            cardChild = cardChildren[i];

            // Get card's name by classname
            if (cardChild.classList.contains('card__title')) {
                title = cardChildren[i].innerText;

            }

            // Get card's amount by classname
            else if (cardChild.classList.contains('card__amount')) {

                // Validate amount field
                if (parseInt(cardChild.value) > 0 && parseInt(cardChild.value) !== '' && !isNaN(parseInt(cardChild.value))) {
                    amount = parseInt(cardChild.value);
                } else {
                    alert('Amount cannot be less than zero!');
                    return false;
                }

            }

            // Get card's image by data-src
            else if (cardChild.classList.contains('card__image')) {
                img = cardChildren[i].getAttribute("src");

            }

            // Get card's price by classname
            else if (cardChild.classList.contains('card__price')) {
                price = cardChildren[i].innerText;
                orignalPrice = parseFloat(cardChildren[i].getAttribute('data-price'));
                // Multiply price by amount
                price = parseFloat(price.replace("$", "")) * amount;

            }


        }

        // Store data in a object
        product = {
            id,
            img,
            title,
            orignalPrice,
            amount,
            price
        }

        const addedProduct = CartCtrl.checkAddedItems(product.id);

        // check if the product is already in the cart
        if (addedProduct) {
            //YES - show message

            alert('This products is already in the cart!');
        } else {
            // NO - add a product to the cart

            CartCtrl.addProduct(product);

            //get total sum
            totalSum = CartCtrl.getTotalSum();
            //show total sum
            UICtrl.showTotalSum(totalSum);

            // add cart to UI
            UICtrl.showItemsInCart(product)


        }
        console.log(CartCtrl.getData());



    }

    showCartsInUI = () => {
        let products;
        products = CartCtrl.getDataFromLS();

        products.forEach((product) => {
            UICtrl.showItemsInCart(product);
        })
    }

    clearAll = (e) => {
        if (e.target.classList.contains("shopping-cart__box--clearAllBtn")) {

            CartCtrl.clearAllItems();
            UICtrl.clearItemsFromUI();

        }
    }

    removeItem = (e) => {
        let id, price, productParent;
        if (e.target.classList.contains('shopping-cart__box--removeBtn')) {
            id = e.target.getAttribute('data-id');
            price = e.target.parentElement.children[2].innerText;
            price = price.replace("Price: ", "");
            price = parseFloat(price.replace("$", ""))


            // remove product from data
            CartCtrl.removeItemById(id, price);

            // Remove product from UI
            productParent = e.target.parentElement.parentElement
            productParent.removeChild(e.target.parentElement);

            //get total sum
            totalSum = CartCtrl.getTotalSum();
            //show total sum
            UICtrl.showTotalSum(totalSum);

        }
    }

    updateAmount = (e) => {
        let newAmount, price, id, fieldPrice;
        if (e.target.classList.contains('shopping-cart__box--input')) {
            id = parseInt(e.target.id);

            newAmount = parseInt(e.target.value);
            newPrice = parseFloat(e.target.nextElementSibling.getAttribute('data-price')) * newAmount;

            console.log(newAmount);
            // Check value of newAmount
            if (newAmount < 1 || isNaN(newAmount)) {
                alert("The amount must be grater than 0");
                return false;
            }

            CartCtrl.updateAmountAndPrice(id, newAmount, newPrice);

            fieldPrice = e.target.nextElementSibling.textContent = `Price: ${newPrice}$`;

            //get total sum
            totalSum = CartCtrl.getTotalSum();
            //show total sum
            UICtrl.showTotalSum(totalSum);

        }
    }

    const searchProducts = function (e) {
        const text = e.target.value.toLowerCase();

        document.querySelectorAll(DOMstrings.card).forEach((product) => {
            const item = product.children[1].textContent

            if (item.toLowerCase().indexOf(text) !== -1) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    window.addEventListener('DOMContentLoaded', () => {
        let cartBoxDOM;
        // buttons
        const buttons = [...document.querySelectorAll(DOMstrings.btnAddCart)];

        //add  event listener for each button
        buttons.forEach((btn) => {
            //add to cart
            btn.addEventListener('click', addItem);
        });

        // show carts in UI
        showCartsInUI()

        //get total sum
        totalSum = CartCtrl.getTotalSum();
        //show total sum
        UICtrl.showTotalSum(totalSum);


        cartBoxDOM = document.querySelector(DOMstrings.shoppingCartBox);

        // Add event listener for clear all button
        cartBoxDOM.addEventListener('click', clearAll);

        ['click', 'change'].forEach(event => {
            // Add event listener for remove single item
            cartBoxDOM.addEventListener(event, (e) => {
                removeItem(e);

                updateAmount(e);
            });
        })

        document.querySelector(DOMstrings.paymentBtn).addEventListener('click', () => {
            //get total sum
            totalSum = CartCtrl.getTotalSum();

            if (totalSum > 0) {
                alert(`Thank you for shopping! You paid ${totalSum}$.`);
                CartCtrl.clearAllItems();
                location.reload();
            } else {
                alert('Your cart is empty!')
            }

        });

        document.querySelector(DOMstrings.searchInput).addEventListener('keyup', searchProducts);

    });



})(CartController, UIController);

