var lastPositionScroll = 0;

window.addEventListener( "scroll", () => {
	var navBarMain = document.querySelector( "header" );
	var menu = document.querySelector( ".nav-list" );

	var currentPositionScroll = window.scrollY;
	var menuIsActive
	if (menu != undefined) {
		menuIsActive = menu.classList.contains( 'active' );
	}
	if ( currentPositionScroll > lastPositionScroll && !menuIsActive  && currentPositionScroll >= window.innerHeight ) {
		navBarMain.style.transform = `translateY(-100%)`;
	} else {
		navBarMain.style.transform = "translateY(0%)";
	}
	lastPositionScroll = currentPositionScroll;
} );