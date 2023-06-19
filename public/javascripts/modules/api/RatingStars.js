const data = [
	{
		'star': 5,
		'count': 754
	},
	{
		'star': 4,
		'count': 3768
	},
	{
		'star': 3,
		'count': 355
	},
	{
		'star': 2,
		'count': 454
	},
	{
		'star': 1,
		'count': 784
	},
];
let total_rating = 0;
let ratting_based_on_star = 0;

data.forEach( rating => {
	total_rating += rating.count;
	ratting_based_on_star += rating.count * rating.star;
} );

data.forEach( rating => {
	let rating__progress = `
<div class="rating__progress-value">
			<p>${ rating.star } <span class="star">&#9733;</span></p>
			<div class="progress">
				<div class="bar" style="width: ${ ( rating.count / total_rating ) * 100 }%"></div>
			</div>
			<p>${ rating.count.toLocaleString() }</p>
		</div>
`;
	document.querySelector( '.rating__progress' ).innerHTML += rating__progress;
} );
let rating__average = ( ratting_based_on_star / total_rating ).toFixed( 1 );
document.querySelector( '.rating__average h3' ).innerHTML = rating__average;
document.querySelector( '.rating__average p' ).innerHTML = total_rating.toLocaleString();
document.querySelectorAll( '.star-outer .star-inner' ).forEach(element=>{
	element.style.width = `${ ( rating__average / 5 ) * 100 }%`;
})