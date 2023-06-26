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

function statusLoaderChat ( status = 0, minTime = 0 ) {
	if ( status == 0 ) {
		setTimeout( () => {
			document.querySelectorAll( '.loader-chat' ).forEach( element => {
				element.style.display = 'none';
			} );
		}, minTime );
	} else if ( status == 1 ) {
		document.querySelectorAll( '.loader-chat' ).forEach( element => {
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

function handleClickEvent() {
	const id_news = this.getAttribute('id_news');
	dialog.setAttribute('id_news', `id_${id_news}`);
	statusLoader(1);
	fetchNewsDetails(id_news);
	fetchComments(id_news);
	statusLoaderChat(1);
}

function fetchNewsDetails(id_news) {
	fetch(`/ratings/read/${id_news}`)
		.then(response => response.json())
		.then(data => {
			statusLoader();
			dialog.showModal();
			fetchRatings(id_news);
			setSelectedRating(data.rating);
			addRatingEventListeners();
		})
		.catch(error => {
			console.error('Erro ao obter detalhes da Noticia:', error);
		});
}

function setSelectedRating(rating) {
	for (let index = 0; index < inputRating.length; index++) {
		if (inputRating[index].getAttribute('id').slice(5) == rating) {
			inputRating[index].checked = true;
		}
	}
}

function addRatingEventListeners() {
	inputRating.forEach(element => {
		element.removeEventListener('click', handleNestedClickEvent);
		element.addEventListener('click', handleNestedClickEvent);
	});
}

function fetchComments(id_news) {
	fetch(`/comments/read/${id_news}`)
		.then(response => response.json())
		.then(data => {
			if (data.length != 0) {
				const fetchPromises = data.map(element =>
					fetch(`/users/read/${element.id_user}`).then(response => response.json())
				);

				Promise.all(fetchPromises)
					.then(users => {
						renderComments(data, users);
						statusLoaderChat(0, 500);
					})
					.catch(error => {
						console.error('Erro ao obter dados dos usuários:', error);
					});
			} else {
				statusLoaderChat(0, 200);
				chat.innerHTML = '<p class="nothing">Não há comentários para esta notícia.</p>';
			}
		});
}

function renderComments(comments, users) {
	comments.forEach((element, index) => {
		const user = users[index];

		chat.innerHTML += `
      <div class="comment">
        <div class="img">
          <img src="https://i.pinimg.com/originals/45/f2/33/45f233d8cca8630bdf0f6b263605b5bd.jpg" alt="">
        </div>
        <div class="text">
          <div class="details">
            <h6>${user.nickname}</h6>
            <span>${element.timestamp}</span>
          </div>
          <p>${element.content}</p>
        </div>
      </div>
    `;
		chat.scrollTop = chat.scrollHeight;
	});
}

// Event listener
document.querySelector('div#form_comment button').addEventListener('click', () => {
	var id_news = dialog.getAttribute('id_news')
	var inputComment = document.querySelector('div#form_comment input');
	const elementoExist = chat.querySelector('p.nothing');
	if (elementoExist) {
		chat.innerHTML = '';
	}
	if (inputComment.value != '') {
		statusLoaderChat(1);
		fetch('/comments/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id_news: id_news, content: inputComment.value })
		})
			.then(response => response.json())
			.then(data => {
				fetch(`/users/read/${data.id_user}`)
					.then(response => response.json())
					.then(user => {
						chat.innerHTML += `
            <div class="comment">
              <div class="img">
                <img src="https://i.pinimg.com/originals/45/f2/33/45f233d8cca8630bdf0f6b263605b5bd.jpg" alt="">
              </div>
              <div class="text">
                <div class="details">
                  <h6>${user.nickname}</h6>
                  <span>${data.timestamp}</span>
                </div>
                <p>${data.content}</p>
              </div>
            </div>
          `;
						chat.scrollTop = chat.scrollHeight;
						inputComment.value = '';
						statusLoaderChat(0);
					});
			});
	}
});


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
	for ( let index = 0; index < bar.length; index++ ) {
		bar[ index ].style.width = `0%`;
	}
	document.querySelectorAll( '.app .star-outer .star-inner' ).forEach( ( element ) => {
		element.style.width = `0%`;
	} );
	chat.innerHTML = '';
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