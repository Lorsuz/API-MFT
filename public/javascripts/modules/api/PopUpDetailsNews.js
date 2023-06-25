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

openDialog.forEach( element_1 => {
	if ( !element_1.hasAttribute( 'click-event-added' ) ) {
		element_1.addEventListener( 'click', handleClickEvent );
		element_1.setAttribute( 'click-event-added', true );
	}
} );

function handleClickEvent () {
	const id_news = this.getAttribute( 'id_news' );
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
			inputRating.forEach( element_2 => {
				element_2.removeEventListener( 'click', handleNestedClickEvent );
				element_2.addEventListener( 'click', handleNestedClickEvent );
			} );
		} )
		.catch( error => {
			console.error( 'Erro ao obter detalhes da Noticia:', error );
		} );
}

function handleNestedClickEvent () {
	var rating = this.getAttribute( 'id' ).slice( 5 );
	var id_news = formRating.getAttribute( 'id_news' ).slice( 3 );
	statusLoader( 1 );
	setTimeout( () => {
		fetch( `/ratings/rate`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify( { id_news: id_news, rating: rating } ),
		} )
			.then( response => response.json() )
			.then( data => {
				statusLoader();
				fetchRatings( data.id_news );
			} )
			.catch( error => console.log( error ) );
	}, 500 );
}

closeDialog.addEventListener( 'click', () => {
	dialog.close();
	for ( let index = 0; index < inputRating.length; index++ ) {
		const element = inputRating[ index ];
		element.checked = false;
	}
	var bar = document.querySelectorAll( '.rating__progress-value .progress .bar' );
	for ( let index = 0; index < bar.length; index++ ) {
		bar[ index ].style.width = `0%`;
	}
} );

function fetchRatings ( id_news ) {
	fetch( `/ratings/count/stars/${ id_news }` )
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
	for ( let index = 0; index < ratings.length; index++ ) {
		bar[ index ].style.width = `${ isNaN( ratings[ index ].count / total_rating ) ? 0 : ( ratings[ index ].count / total_rating ) * 100 }%`;
		count[ index ].textContent = ratings[ index ].count.toLocaleString();
	}

	let rating__average = ( ratting_based_on_star / total_rating ).toFixed( 1 );
	rating__average = isNaN( rating__average ) ? 0 : rating__average;

	document.querySelector( '.rating__average h3' ).innerHTML = rating__average;
	document.querySelector( '.rating__average p' ).innerHTML = total_rating.toLocaleString();
	document.querySelectorAll( '.app .star-outer .star-inner' ).forEach( ( element ) => {
		element.style.width = `${ isNaN( rating__average / 5 ) ? 0 : ( rating__average / 5 ) * 100 }%`;
	} );
	var starCard = document.querySelector( `.card#id_news_${ id_news } .star-outer .star-inner` );
	starCard.style.width = `${ isNaN( rating__average / 5 ) ? 0 : ( rating__average / 5 ) * 100 }%`;
}