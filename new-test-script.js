(function(appWindow, appDocument){

	'use strict';

	var currentCartItem;

	function getRequestToJson(request){

		var requestJson;

		requestJson = {};
		if(request == undefined || request.trim() == '')
			return {};

		if(typeof request == 'string'){
			try{
				requestJson = JSON.parse(request);
			}catch(errorMessage){

				if(request.indexOf('&') > -1 && request.indexOf('=') > -1){

					var formDataObject = {};
					for(var pair of new URLSearchParams(request).entries()){
						formDataObject[pair[0]] = pair[1];
					}
					requestJson = formDataObject;
				}
			}
		}else if(request instanceof FormData){

			var formDataObject = {};
			fetchBody.forEach(function(value, key){
				if(key != 'utf8')
					formDataObject[key] = value;
			});
			requestJson = formDataObject;
		}else if(typeof request == 'object'){
			requestJson = request;
		}
		return requestJson;
	};

	function documentLoaded(){

		appDocument.querySelectorAll('a[href*="products/"]').forEach(function(element){
			element.addEventListener('click', onProductView);
		});

		var originalSendEvent = appWindow.XMLHttpRequest.prototype.send;
		appWindow.XMLHttpRequest.prototype.send = function(sendData){
			this.addEventListener('load', function(loadData){
				if(this._url == '/cart/add.js' || this._url == '/cart/add'){

					var itemJson = getRequestToJson(sendData);
					if(typeof itemJson == 'object' && (itemJson.id || itemJson.items)){

						var addToCartQty = (itemJson.quantity) ? itemJson.quantity : 1;
						itemJson = JSON.parse(this.response);
						itemJson.quantity = addToCartQty;

						onAddedToCart(itemJson);
					}
				}else if(this._url == '/cart/change.js' || this._url == '/cart/change'){
					onChangeCart(JSON.parse(this.response));
				}
			});
			return originalSendEvent.apply(this, arguments);
		};

		var originalFetchEvent = appWindow.fetch;
		appWindow.fetch = function(fetchUrl, options){
			return originalFetchEvent.apply(window, arguments).then((response) => {
				if(fetchUrl == '/cart/add.js' || fetchUrl == '/cart/add' || fetchUrl == '/cart/change.js' || fetchUrl == '/cart/change')
					onChangeCart();
				return response;
			});
		};
	};

	function onProductView(event){

		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
		
		onSendData('Product Click', {
			link: event.target.href
		}, function(){
			setTimeout(function(){
				appWindow.location.href = event.target.href;
			}, 2000);
		});
	};

	function onAddedToCart(item){

		onSendData('Added To Cart', item);
		return onUpdateCart();
	};

	function onRemoveToCart(item){
		onSendData('Remove To Cart', item);
	};

	function onChangeCart(response = {}){

		if(currentCartItem != undefined && currentCartItem.length !== 0){
			if(response == undefined || (Object.keys(response).length === 0 && response.constructor === Object)){

				var oldCurrentCartItem = currentCartItem;
				onUpdateCart(function(){
					response.items = currentCartItem;
					currentCartItem = oldCurrentCartItem;
					onCartHandler(response);
				});
			}else{
				onCartHandler(response);
			}
		}else{

			onUpdateCart(function(){
				currentCartItem.forEach(function(cartItem){
					onAddedToCart(cartItem);
				});
			});
		}

		return true;
	};

	function onCartHandler(response){

		var cartItemList;

		cartItemList = {};
		currentCartItem.forEach(function(cartItem){
			cartItemList[cartItem.key] = cartItem;
		});

		response.items.forEach(function(item){
			if(cartItemList[item.key]){

				var cartItem = cartItemList[item.key];
				if(parseInt(cartItem.quantity) != parseInt(item.quantity)){
					if(cartItem.quantity < item.quantity)
						onAddedToCart(fetchCartItemDifference(cartItem, item));
					else
						onRemoveToCart(fetchCartItemDifference(cartItem, item));
				}
				delete cartItemList[item.key];
			}else{
				onAddedToCart(item);
			}
		});

		if(Object.keys(cartItemList).length !== 0 && cartItemList.constructor === Object){
			Object.keys(cartItemList).forEach(function(itemIdKey){
				onRemoveToCart(cartItemList[itemIdKey]);
				delete cartItemList[itemIdKey];
			});
		}
		return onUpdateCart();
	};

	async function onUpdateCart(callback = new Function){

		await fetch('/cart.js').then(function(response){
			if(response.status == 200)
				return response.json();
		}).then(function(response){
			if(response != undefined)
				currentCartItem = response.items;
			callback();
		});
	};

	function fetchCartItemDifference(oldItem, newItem){

		var itemQty, imageUrl;

		itemQty = newItem.quantity;
		if(oldItem.quantity < newItem.quantity)
			itemQty = parseInt(newItem.quantity) - parseInt(oldItem.quantity);
		else if(oldItem.quantity > newItem.quantity)
			itemQty = parseInt(oldItem.quantity) - parseInt(newItem.quantity);

		newItem.quantity = itemQty;
		return newItem;
	};

	function onSendData(type, params = {}, callback = new Function){
		console.log(type, params);
		callback();
	};

	onUpdateCart();
	if(appDocument.readyState === "complete" || appDocument.readyState === "interactive")
		setTimeout(documentLoaded, 1);
	else
		appDocument.addEventListener("DOMContentLoaded", documentLoaded);
})(window, document);
