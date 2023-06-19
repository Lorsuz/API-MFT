const input = document.querySelector( '.search-box input' );
const container = document.querySelector( '#cardNews' );
const response = document.querySelector( '#response' );

input.addEventListener( 'input', function () {
	const valueSearch = input.value;
	
	fetch( `/news/search?search=${ valueSearch }` )
	.then( response => response.json() )
	.then( data => {

		container.innerHTML = ''
		data.forEach(element => {
			container.innerHTML+=`
			<div class="card">
			<div class="box-img">
				<div class="img">
					<img src="${element.image}" target="_blank" alt="">
				</div>
				<div class="details">
						<button class="open-dialog" id_news="${element.id}" id_user="${element.id}">
							<i class="fa-solid fa-circle-info"></i>
							<div class="star">
								<i class="fa-regular fa-star"></i>
								<i class="fa-regular fa-star"></i>
								<i class="fa-regular fa-star"></i>
								<i class="fa-regular fa-star"></i>
								<i class="fa-regular fa-star"></i>
							</div>
						</button>
							<span class="date">
								${element.release}
							</span>
				</div>
			</div>
			<div class="text">
				<h3>
					${element.title}
				</h3>
				<p>
					${element.description}
				</p>
				<div class="more"><a href="${element.link}" target="_blank"><span>Ler mais</span> <i
							class="fa-solid fa-arrow-right"></i></a></div>
			</div>
		</div>
			`
		});

		} )
		.catch( error => {
			console.error( 'Erro ao obter detalhes da Notcia:', error );
		} );
} );

router.get( '/news/search', async ( req, res, next ) => {
	var search = req.query.search;
	var results = {};

	console.log( search );
	if ( search != undefined && search != '' ) {
		console.log( search );
		results = await News.readSearch( 'title', search );
	} else {
		search = '';
		results = await News.readAll();
	}
	res.json( results );
} );