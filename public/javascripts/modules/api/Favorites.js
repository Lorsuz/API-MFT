var favorites = document.querySelectorAll( '.favorite' );
favorites.forEach( element => {
	element.addEventListener( 'click', async () => {
		var id_news = element.getAttribute( 'id_news' ).slice( 8 );
		console.log( id_news );
		var value = await fetch( `/favorites/${ id_news }` );
		console.log( value );
		element.innerHTML =
			value ?
				`<i class="fa-solid fa-bookmark"></i>` :
				`<i class="fa-regular fa-bookmark"></i>`;
	} );
} );

favorites.forEach( async element => {
	var id_news = element.getAttribute( 'id_news' ).slice( 8 );
	console.log( id_news );
	var value = await fetch( `/favorites/${ id_news }` );
	console.log( value );
	element.innerHTML =
		value ?
			`<i class="fa-solid fa-bookmark"></i>` :
			`<i class="fa-regular fa-bookmark"></i>`;
} );