fetch( `/news` )
	.then( response => response.json() )
	.then( data => {
		for ( const key in data ) {
			if ( Object.hasOwnProperty.call( data, key ) ) {
				const element = data[ key ];
				getRatings(element.id)
				document.querySelector( '.rating__progress' ).innerHTML = '';
			}
		}
	} )
	.catch( error => {
		console.error( 'Erro ao obter detalhes da Noticia:', error );
	} );

function getRating ( id_news ) {
	fetch( `/ratings/read/${ id_news }` )
		.then( response => response.json() )
		.then( data => {
			for ( let index = 0; index < inputRating.length; index++ ) {
				const element = inputRating[ index ];
				element.checked = false;
				if ( element.getAttribute( 'id' ).slice( 5 ) == data.rating ) {
					element.checked = true;
				}
			}
		} )
		.catch( error => { } );
}



function fetchRatings ( id_news ) { 
	fetch( `/ratings/${ id_news }` )
		.then( response => response.json() )
		.then( data => {
			getRatings( data.ratings );
		} )
		.catch( error => {
			console.error( 'Erro ao obter detalhes da Noticia:', error );
		} );
}

function getRatings ( ratings ) {
	console.log(ratings);
	let total_rating = 0;
	let ratting_based_on_star = 0;

	ratings.forEach( ( rating ) => {
		total_rating += rating.count;
		ratting_based_on_star += rating.count * rating.star;
	} );

	ratings.forEach( ( rating ) => {
		let rating__progress = `
      <div class="rating__progress-value">
        <p>${ rating.star } <span class="star">&#9733;</span></p>
        <div class="progress">
          <div class="bar" style="width: ${ isNaN( rating.count / total_rating ) ? 0 : ( rating.count / total_rating ) * 100 }%"></div>
        </div>
        <p>${ rating.count.toLocaleString() }</p>
      </div>
    `;
		document.querySelector( '.rating__progress' ).innerHTML += rating__progress;
	} );

	let rating__average = ( ratting_based_on_star / total_rating ).toFixed( 1 );
	rating__average = isNaN( rating__average ) ? 0 : rating__average;

	document.querySelector( '.rating__average h3' ).innerHTML = rating__average;
	document.querySelector( '.rating__average p' ).innerHTML = total_rating.toLocaleString();
	document.querySelectorAll( '.star-outer .star-inner' ).forEach( ( element ) => {
		element.style.width = `${ isNaN( rating__average / 5 ) ? 0 : ( rating__average / 5 ) * 100 }%`;
	} );
}