/*
	class to generically represent any databased object
	
	publish()
		- assumes that array "logistic" is a list of keys to avoid display
*/



class Hydration {

	constructor( init ){

		init = init || init
		for( const key in init ){
			this[ key ] = init[ key ]
		}
		if( !Array.isArray( this.logistic )) this.logistic = []

	}

	publish( ...excepted ){

		if( !Array.isArray( excepted )) excepted = []
		const display_object = {}
		for( const key in this ){
			if( !this.logistic.includes( key ) || excepted.includes( key ) ){
				display_object[ key ] = this[ key ]
			}
		}
		return display_object

	}

}

export default Hydration