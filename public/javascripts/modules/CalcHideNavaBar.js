var lastPositionScroll = 0;

window.addEventListener( "scroll", () => {
	var navBarMain = document.querySelector( "header" );
	var menu = document.querySelector(".nav-list")

	var currentPositionScroll = window.scrollY;
	var  menuIsActive = menu.classList.contains('active')

	if ( currentPositionScroll > lastPositionScroll && currentPositionScroll > window.innerHeight && !menuIsActive) {
		navBarMain.classList.remove( "sticky" );
		navBarMain.style.top = `-${ ( window.innerHeight / 100 ) * 10 }px`;
	} else {
		navBarMain.classList.add( "sticky" );
		navBarMain.style.top = "0px";
	}
	if ( currentPositionScroll < 80 ) {
		navBarMain.classList.remove( "sticky" );
		navBarMain.style.top = "0px";
	}
	lastPositionScroll = currentPositionScroll;
} );