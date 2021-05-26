console.log(window.location.href);

    document.addEventListener('click', function(e) {
    console.log(e.target);
});

// document.querySelector('.grid-view-item__link').addEventListener('click', function(e) {
//     console.log(e.target.href);
// });
    
    var getCustomerId = function() {
    try {
      let curr = window.ShopifyAnalytics.meta.page.customerId;
      if (curr !== undefined && curr !== null && curr !== "") {
        return curr;
      }
    } catch(e) { }
    try {
      let curr = window.meta.page.customerId;
      if (curr !== undefined && curr !== null && curr !== "") {
        return curr;
      }
    } catch (e) { }    
    try {
      let curr = _st.cid;
      if (curr !== undefined && curr !== null && curr !== "") {
        return curr;
      }
    } catch (e) { }
    try {
      let curr = ShopifyAnalytics.lib.user().traits().uniqToken;
      if (curr !== undefined && curr !== null && curr !== "") {
        return curr;
      }
    } catch (e) { }
    return null;
  }
    
//     customerId = getCustomerId();

//     console.log("customer", customerId);
// var productCard = document.querySelectorAll('.product-card');
// productCard.forEach(item => {
//     item.addEventListener('click', function(e) {
//         console.log(e.target);
//         var productName = item.querySelector('.grid-view-item__title').innerHTML;
//         var productLink = item.querySelector('a').href;
//       	sendData(productName, productLink);
//         console.log(productName);
//         console.log(productLink);
//     })
// });
     console.log(window.location.href);

var productPage = window.location.href.includes('/products');
var collectionsPage = window.location.href.includes('/collections');
var cartPage = window.location.href.includes('/cart');
let cartUrl;
let collectionUrl;
// document.getElementById("product_form_6545289150673").addEventListener("click", function() {
//    console.log('Add to cart clicked ');
//    getProductDetails();
// });
          
if(productPage){
document.querySelector('select[name=id]').parentElement.addEventListener('click', function(){
    console.log('Added to cart clicked ');
     getCartDetails();
})
}    
if(productPage){
getProductDetails();
}
if(collectionsPage){
var productCard = document.querySelectorAll('.product-card');
productCard.forEach(item => {
    item.addEventListener('cart', function(e) {
       console.log('hovered to cart clicked ', e.target);
        var productName = item.querySelector('.grid-view-item__title').innerHTML;
        var productLink = item.querySelector('a').href;
      	var eventType = 'hover';
       	sendData(productName, productLink, eventType);
        console.log("hovered name: ", productName);
        console.log("hovered link: ", productLink);
    })
});
}
if(collectionsPage){
  console.log(window.location.host);
  collectionUrl = 'https://'+window.location.host+'/collections.json';
  getCollectionDetails();
}
if(cartPage){
  console.log(window.location.host);
//   cartUrl = 'https://'+window.location.host+'/cart.json';
//   getCartDetails();
 var test = document.querySelectorAll('.cart__remove');
test.forEach(item => {
    item.addEventListener('click', function(e) {
      console.log('removed to cart clicked ', e);
      var test = e.target;
      console.log("test :", test);
      console.log("class:", test.className);
      if(test.className === 'text-link text-link--accent'){
			test = e.target.parentElement
        }
      		var parent = test.parentElement;
      		console.log("parent :", parent);
      
      var title = parent.querySelector('a.cart__product-title').innerHTML;
      var titleName = title.replace(/\n/g, " ").trim();
       var searchTitleName = titleName.replace(/ /g,"-");
      console.log('title :', searchTitleName);
      cartUrl = 'https://'+window.location.host + '/products/' + encodeURI(searchTitleName) + '.json';
      const http = new XMLHttpRequest()
    	http.open('GET', cartUrl )
        http.setRequestHeader('Content-type', 'application/json');
  		http.setRequestHeader('Access-Control-Allow-Origin', '*');
    	http.setRequestHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        http.setRequestHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');  
  		http.send() // Make sure to stringify
        http.onload = function() {
            // Do whatever with response
              data = JSON.parse(http.responseText);
              console.log(data.product.title);
              var productName = data.product.title;
              var productId = data.product.id;
          	  var eventType = 'cartremove';
              productData(productName, productId, eventType)
        }

      
})
})
}

function getProductDetails() {
  console.log("page");
  const url = window.location+'.json';
    const http = new XMLHttpRequest()
    	http.open('GET', url )
        http.setRequestHeader('Content-type', 'application/json');
  		http.setRequestHeader('Access-Control-Allow-Origin', '*');
    	http.setRequestHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        http.setRequestHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');  
  		http.send() // Make sure to stringify
        http.onload = function() {
            // Do whatever with response
              data = JSON.parse(http.responseText);
              console.log(data.product.title);
              var productName = data.product.title;
              var productId = data.product.id;
          	  var eventType = 'click';
              productData(productName, productId, eventType)
        }

}
    
function getCartDetails() {
  console.log("page");
  const url = window.location+'.json';
    const http = new XMLHttpRequest()
    	http.open('GET', url )
        http.setRequestHeader('Content-type', 'application/json');
  		http.setRequestHeader('Access-Control-Allow-Origin', '*');
    	http.setRequestHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        http.setRequestHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');  
  		http.send() // Make sure to stringify
        http.onload = function() {
            // Do whatever with response
              data = JSON.parse(http.responseText);
              console.log(data.product.title);
              var productName = data.product.title;
              var productId = data.product.id;
          	  var eventType = 'cartadd';
              productData(productName, productId, eventType)
        }

}


function getCollectionDetails() {
  console.log(collectionUrl);
fetch(collectionUrl)
  .then(response => response.json())
  .then(data => console.log(data));
}
    
const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
};
function productData(name, id, type) {
  var customerId = getCustomerId();
  console.log("customer", customerId);
    const params = {
      storename: Shopify.shop,
      productname: name,
      producturl: id,
      eventtype: type,
      device: getDeviceType()
    }
  
  if(customerId){
    params.customerId = customerId;
  }
  
  
    console.log(params);
  const url = "https://dev-shopify.ambertag.com/event";
    const http = new XMLHttpRequest()
    	http.open('POST', url )
        http.setRequestHeader('Content-type', 'application/json');
  		http.setRequestHeader('Access-Control-Allow-Origin', '*');
    	http.setRequestHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        http.setRequestHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  		http.send(JSON.stringify(params)) // Make sure to stringify
        http.onload = function() {
            // Do whatever with response
            console.log(http.responseText)
        }
    }
function sendData(name, link, type) {
    var customerId = getCustomerId();
    console.log("customer", customerId);
    const params = {
      storename: Shopify.shop,
      productname: name,
      producturl: link,
      eventtype: type,
      device: getDeviceType()
    }
  
  if(customerId){
    params.customerId = customerId;
  }
  
  
    console.log(params);
  const url = "https://dev-shopify.ambertag.com/event";
    const http = new XMLHttpRequest()
    	http.open('POST', url )
        http.setRequestHeader('Content-type', 'application/json');
        http.setRequestHeader('Access-Control-Allow-Origin', '*');
    	http.setRequestHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        http.setRequestHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  		http.send(JSON.stringify(params)) // Make sure to stringify
        http.onload = function() {
            // Do whatever with response
            console.log(http.responseText)
        }
    }
