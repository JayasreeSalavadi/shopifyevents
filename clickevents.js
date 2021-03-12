console.log(window.location.href);

var productPage = window.location.href.includes('/products');
var collectionsPage = window.location.href.includes('/collections');
let collectionUrl;
if(collectionsPage){
  console.log(window.location.host);
  collectionUrl = 'https://'+window.location.host+'/collections.json';
  getCollectionDetails();
}
if(productPage){
getProductDetails();
}

function getProductDetails() {
fetch(window.location+'.json')
  .then(response => response.json())
  .then(data => console.log(data));
}
function getCollectionDetails() {
  console.log(collectionUrl);
fetch(collectionUrl)
  .then(response => response.json())
  .then(data => console.log(data));
}