var pathDialog = "dialog#info-card-news";
var dialog = document.querySelector( pathDialog );

var openDialog = document.querySelectorAll( "button.open-dialog" );
var closeDialog = document.querySelector( "button.close-dialog" );

var formRating = document.querySelector( `${ pathDialog } form.container` );
var inputRating = document.querySelectorAll( `${ pathDialog } form.container input[type="radio"]` );

function statusLoader ( status = 0 ) {
	if ( status == 0 ) {
		setTimeout( () => {
			document.querySelectorAll( '.loader' ).forEach( element => {
				element.style.display = 'none';
			} );
		}, 500 );
	} else if ( status == 1 ) {
		document.querySelectorAll( '.loader' ).forEach( element => {
			element.style.display = 'flex';
		} );
	}
}


openDialog.forEach( element => {
	element.addEventListener( 'click', () => {
		const id_news = element.getAttribute( 'id_news' );
		formRating.setAttribute( 'id_news', `id_${ id_news }` );
		fetch( `/ratings/read/${ id_news }` )
			.then( response => response.json() )
			.then( data => {
				dialog.showModal();
				fetchRatings( id_news );
				for ( let index = 0; index < inputRating.length; index++ ) {
					if ( inputRating[ index ].getAttribute( 'id' ).slice( 5 ) == data.rating ) {
						inputRating[ index ].checked = true;
					}
				}

				inputRating.forEach( element => {
					element.addEventListener( 'click', () => {
						var rating = element.getAttribute( 'id' ).slice( 5 );
						var id_news = formRating.getAttribute( 'id_news' ).slice( 3 );
						statusLoader( 1 );
						setTimeout( () => {
							fetch( `/ratings/rate`, {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify( { id_news: id_news, rating: rating } )
							} ).then( response => response.json() )
								.then( data => {
									statusLoader();
									fetchRatings( data.id_news );
								} )
								.catch( error => console.log( error ) );
						}, 500 );
					} );
				} );


			} )
			.catch( error => {
				console.error( 'Erro ao obter detalhes da Noticia:', error );
			} );

	} );
} );

closeDialog.addEventListener( 'click', () => {
	dialog.close();
	for ( let index = 0; index < inputRating.length; index++ ) {
		const element = inputRating[ index ];
		element.checked = false;
	}
} );

function fetchRatings ( id_news ) {
	fetch( `/ratings/${ id_news }` )
		.then( response => response.json() )
		.then( data => {
			getRatings( data.ratings, id_news );
		} )
		.catch( error => {
			console.error( 'Erro ao obter detalhes da Noticia:', error );
		} );
}

function getRatings ( ratings, id_news ) {
	let total_rating = 0;
	let ratting_based_on_star = 0;

	ratings.forEach( ( rating ) => {
		total_rating += rating.count;
		ratting_based_on_star += rating.count * rating.star;
	} );
	var bar = document.querySelectorAll( '.rating__progress-value .progress .bar' );
	var count = document.querySelectorAll( '.rating__progress-value p.count' );
	console.log(bar);
	console.log(count);
	for (let index = 0; index < ratings.length; index++) {
		console.log(index);
		bar[index].style.width = `${ isNaN( ratings[index].count / total_rating ) ? 0 : ( ratings[index].count / total_rating ) * 100 }%`;
		console.log(bar[index]);
		count[index].textContent = ratings[index].count.toLocaleString()
		console.log(count[index]);
	}

	let rating__average = ( ratting_based_on_star / total_rating ).toFixed( 1 );
	rating__average = isNaN( rating__average ) ? 0 : rating__average;

	document.querySelector( '.rating__average h3' ).innerHTML = rating__average;
	document.querySelector( '.rating__average p' ).innerHTML = total_rating.toLocaleString();
	document.querySelectorAll( '.app .star-outer .star-inner' ).forEach( ( element ) => {
		element.style.width = `${ isNaN( rating__average / 5 ) ? 0 : ( rating__average / 5 ) * 100 }%`;
	} );
	var starCard = document.querySelector( `.card#id_news_${ id_news } .star-outer .star-inner` );
	console.log( starCard );
	starCard.style.width = `${ isNaN( rating__average / 5 ) ? 0 : ( rating__average / 5 ) * 100 }%`;
}

