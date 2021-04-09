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
    
    customerId = getCustomerId();

    
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
let collectionUrl;
// document.getElementById("product_form_6545289150673").addEventListener("click", function() {
//    console.log('Add to cart clicked ');
//    getProductDetails();
// });
          
if(productPage){
document.querySelector('select[name=id]').parentElement.addEventListener('click', function(){
    console.log('Add to cart clicked ');
     getProductDetails();
})
   
}
if(collectionsPage){
  console.log(window.location.host);
  collectionUrl = 'https://'+window.location.host+'/collections.json';
  getCollectionDetails();
}
     
if(productPage){
getProductDetails();
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
              productData(productName, productId)
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
function productData(name, id) {
    const params = {
      storeName: Shopify.shop,
      productname: name,
      producturl: id,
      device: getDeviceType()
    }
  
  if(customerId){
    params.customerId = customerId;
  }
  
  
    console.log(params);
  const url = "http://dev-shopify.ambertag.com:3000/";
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
function sendData(name, link) {
    const params = {
      storeName: Shopify.shop,
      productname: name,
      producturl: link,
      device: getDeviceType()
    }
  
  if(customerId){
    params.customerId = customerId;
  }
  
  
    console.log(params);
  const url = "http://dev-shopify.ambertag.com:3000/";
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
