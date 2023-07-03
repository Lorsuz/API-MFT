var pathDialog = "dialog#info-card-news";
var dialog = document.querySelector( pathDialog );

var openDialog = document.querySelectorAll( "button.open-dialog" );
var closeDialog = document.querySelector( "button.close-dialog" );

var formRating = document.querySelector( `${ pathDialog } form.container` );
var inputRating = document.querySelectorAll( `${ pathDialog } form.container input[type="radio"]` );

var chat = document.querySelector( `${ pathDialog } .comments .chat` );

function statusLoader ( status = 0, minTime = 0 ) {
	if ( status == 0 ) {
		setTimeout( () => {
			document.querySelectorAll( '.loader' ).forEach( element => {
				element.style.display = 'none';
			} );
		}, minTime );
	} else if ( status == 1 ) {
		document.querySelectorAll( '.loader' ).forEach( element => {
			element.style.display = 'flex';
		} );
	}
}

function statusLoaderChat ( status = false ) {
	if ( status ) {
		document.querySelector( '.loader-chat' ).style.display = 'flex';
	} else {
		setTimeout( () => {
			document.querySelector( '.loader-chat' ).style.display = 'none';
		}, 200 );
	}
}

openDialog.forEach( element => {
	chat.innerHTML = '';
	if ( !element.hasAttribute( 'click-event-added' ) ) {
		element.addEventListener( 'click', handleClickEvent );
		element.setAttribute( 'click-event-added', true );
	}
} );

async function handleClickEvent () {
	const id_news = this.getAttribute( 'id_news' );
	dialog.setAttribute( 'id_news', `id_${ id_news }` );
	statusLoader( 1 );
	await fetchNewsDetails( id_news );
	await fetchComments( id_news );
}

async function fetchNewsDetails ( id_news ) {
	try {
		const response = await fetch( `/ratings/read/${ id_news }` );
		const data = await response.json();
		statusLoader();
		dialog.showModal();
		await fetchRatings( id_news );
		setSelectedRating( data.rating );
		addRatingEventListeners();
	} catch ( error ) {
		console.error( 'Erro ao obter detalhes da Noticia:', error );
	}
}

function setSelectedRating ( rating ) {
	for ( let index = 0; index < inputRating.length; index++ ) {
		if ( inputRating[ index ].getAttribute( 'id' ).slice( 5 ) == rating ) {
			inputRating[ index ].checked = true;
		}
	}
}

function addRatingEventListeners () {
	inputRating.forEach( element => {
		element.removeEventListener( 'click', handleNestedClickEvent );
		element.addEventListener( 'click', handleNestedClickEvent );
	} );
}

async function fetchComments ( id_news ) {
	try {
		const response = await fetch( `/comments/read/${ id_news }` );
		const data = await response.json();
		if ( data.length != 0 ) {
			const fetchPromises = await data.map( element => fetch( `/users/read/${ element.id_user }` )
				.then( response => response.json() )
			);
			const users = await Promise.all( fetchPromises );
			renderComments( data, users );
		} else {
			chat.innerHTML = '<p class="nothing">Não há comentários para esta notícia.</p>';
		}
	} catch ( error ) {
		console.error( 'Erro ao obter comentarios dos usuários:', error.message );
	}
}

async function renderComments ( comments, users ) {
	await comments.forEach( ( element, index ) => {
		const user = users[ index ];
		chat.innerHTML += `
      <div class="comment">
        <div class="img">
          <img src="/images/uploads/profiles/${ user.profile }" alt="">
        </div>
        <div class="text">
          <div class="details">
            <a href="/users/dashboard/${ user.nickname }">@${ user.nickname }</a>
            <span>${ element.timestamp }</span>
          </div>
          <p>${ element.content }</p>
        </div>
      </div>
    `;
		chat.scrollTop = chat.scrollHeight;
	} );
}

// Event listener
document.querySelector( 'div#form_comment button' ).addEventListener( 'click', () => {
	var id_news = dialog.getAttribute( 'id_news' );
	var inputComment = document.querySelector( 'div#form_comment input' );
	const elementoExist = chat.querySelector( 'p.nothing' );
	if ( elementoExist ) {
		chat.innerHTML = '';
	}
	if ( inputComment.value != '' ) {
		fetch( '/comments/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify( { id_news: id_news.slice( 3 ), content: inputComment.value } )
		} )
			.then( response => response.json() )
			.then( data => {
				fetch( `/users/read/${ data.id_user }` )
					.then( response => response.json() )
					.then( user => {
						chat.innerHTML += `
            <div class="comment">
              <div class="img">
                <img src="/images/uploads/profiles/${ user.profile }" alt="">
								</div>
								<div class="text">
                <div class="details">
								<a href="/users/dashboard/${ user.nickname }">@${ user.nickname }</a>
								<span>${ data.timestamp }</span>
                </div>
                <p>${ data.content }</p>
								</div>
								</div>
								`;
						chat.scrollTop = chat.scrollHeight;
						inputComment.value = '';
					} );
			} );
	}
} );

function handleNestedClickEvent () {
	var rating = this.getAttribute( 'id' ).slice( 5 );
	var id_news = dialog.getAttribute( 'id_news' ).slice( 3 );
	statusLoader( 1 );
	fetch( `/ratings/rate`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify( { id_news: id_news, rating: rating } ),
	} )
		.then( response => response.json() )
		.then( data => {
			statusLoader( 0, 500 );
			fetchRatings( data.id_news );
		} );
}

closeDialog.addEventListener( 'click', () => {
	dialog.close();
	for ( let index = 0; index < inputRating.length; index++ ) {
		const element = inputRating[ index ];
		element.checked = false;
	}
	var bar = document.querySelectorAll( '.rating__progress-value .progress .bar' );
	bar = Array.from( bar );
	for ( let index = 0; index < bar.length; index++ ) {
		bar[ index ].style.width = `0%`;
	}
	document.querySelectorAll( '.app .star-outer .star-inner' ).forEach( ( element ) => {
		element.style.width = `0%`;
	} );
	chat.innerHTML = '';
} );

async function fetchRatings ( id_news ) {
	try {
		const response = await fetch( `/ratings/count/stars/${ id_news }` );
		const data = await response.json();
		getRatings( data.ratings, id_news );
	} catch ( error ) {
		console.error( 'Erro ao obter detalhes da Noticia:', error );
	}
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

	bar = Array.from( bar );
	count = Array.from( count );
	bar.reverse();
	count.reverse();

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
