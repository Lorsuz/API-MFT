class MobileNavbar {
	constructor ( mobileMenu, navList, navLinks ) {
		this.mobileMenu = document.querySelector( mobileMenu );
		this.navList = document.querySelector( navList );
		this.navLinks = document.querySelectorAll( navLinks );
		this.activeClass = "active";
		this.handleClick = this.handleClick.bind( this );
		// this.init()
	}

	init () {
		if ( this.mobileMenu ) {
			this.addClickEvent();
		}
		return this;
	}

	addClickEvent () {
		this.mobileMenu.addEventListener( "click", this.handleClick );
	}

	handleClick () {
		this.navList.classList.toggle( this.activeClass );
		this.mobileMenu.classList.toggle( this.activeClass );
		this.animateLinks();
	}

	animateLinks () {
		this.navLinks.forEach( ( link, index ) => {
			link.style.animation
				? ( link.style.animation = "" )
				: ( link.style.animation = `navLinkFade 0.5s ease forwards ${ index / 7 + 0.3 }s` );
		} );
	}
}

const mobileNavbar = new MobileNavbar(
	"#profile",
	".nav-list",
	".nav-list ul li",
	""
);
mobileNavbar.init();