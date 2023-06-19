popUpDetailsNews();

	function popUpDetailsNews () {
		var pathDialog = "dialog#info-card-news";
		var dialog = document.querySelector( pathDialog );

		var openDialog = document.querySelectorAll( "button.open-dialog" );
		var closeDialog = document.querySelector( "button.close-dialog" );

		/* var detailsCardNews = {
			spaceTitle: document 
		} */

		// var newsTitle = document.querySelector( `${ pathDialog } .details-news h2` );
		// var newsDescription = document.querySelector( `${ pathDialog } .details-news p.newsDescription` );

		// newsTitle.textContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit";
		// newsDescription.textContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat ab praesentium voluptas quos neque unde molestiae aliquam quo quod recusandae eaque ullam impedit iusto, alias voluptatem nihil maxime corrupti! Aliquam, dolorum? Quo perspiciatis possimus quibusdam iusto sapiente? Quo, alias asperiores.";
		

		openDialog.forEach( element => {
			element.addEventListener( 'click', () => {

				const idNews = element.getAttribute( 'id_news' );

				fetch( `/news/read/${ idNews }` )
					.then( response => response.json() )
					.then( data => {

						// newsTitle.textContent = data.title;
						// newsDescription.textContent = data.description;

						dialog.showModal();
					} )
					.catch( error => {
						console.error( 'Erro ao obter detalhes da Notcia:', error );
					} );
			} );
		} );

		closeDialog.addEventListener( 'click', () => {
			console.log( "Fechou" );
			dialog.close();
		} );
	}