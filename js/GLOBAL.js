import env from './env.js'


let g = false

export default (function(){

	if( g ) return g

	if( !document.getElementById('site-data') ){
		console.log('could not find global data')
		return false
	}

	try{
		g = JSON.parse( document.getElementById('site-data').innerHTML.trim() )
	}catch(e){
		console.log(e)
		return false
	}

	g.is_admin = document.querySelector('#admin-login') ? true : false

	if( env.LOCAL )  window.GLOBAL = g

	return g

	// fetch('/global_public', {
	// 	method: 'get'
	// })
	// .then( res => {
	// 	res.json()
	// 	.then( r => {
	// 		for( const key of Object.keys( r ) ){
	// 			g[ key ] = r[ key ]
	// 		}
	// 	})
	// 	.catch( err => { console.log('flag', err )})
	// }).catch( err => { console.log('flag', err )})

})()
