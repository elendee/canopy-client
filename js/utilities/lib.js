

function rgb_to_hex( rgb_color, received_scale, type ){
	let numbers
	if( type == 'array' ){
		numbers = rgb_color
	}else{
		numbers = rgb_color.split("(")[1].split(")")[0];
		numbers = numbers.split(",");
		numbers.forEach(function( num ){
			num = num.trim()
		})
	}
	if( received_scale === 1 ){
		for( let i=0; i < numbers.length; i++ ){
			numbers[i] *= 255
		}
	}else if( received_scale !== 255 ){
		return '#000'
	}
	let b = numbers.map( function(x){						 
		x = parseInt( x ).toString( 16 )
		return ( x.length == 1 ) ? "0" + x : x
	})
	b = "0x" + b.join
	return b
}





function capitalize( input ){

	if( typeof input !== 'string' ) return undefined

	return input.charAt(0).toUpperCase() + input.slice(1);

}








function is_valid_website( website ){

	let valid = true

	if( typeof( website ) !== 'string' ) valid = false

	if( !website.match(/\..*/) ) valid = false

	if( !valid ){
		log('flag', 'invalid website')
		return false
	}

	return true

}




function random_hex( len ){

	//	let r = '#' + Math.floor( Math.random() * 16777215 ).toString(16)
	let s = ''
	
	for( let i = 0; i < len; i++){
		
		s += Math.floor( Math.random() * 16 ).toString( 16 )

	}
	
	return s

}



function random_rgb( ...ranges ){ // ( [0,255], [0,255], [0,255] )

	let inc = 0
	let string = 'rgb('

	for( const range of ranges ){

		if( range[1] < range[0] || range[0] < 0 || range[1] > 255 ) return 'rgb( 0, 0, 0 )'

		string += range[0] + Math.floor( Math.random() * ( range[1] - range[0] )) 

		inc < 2 ? string += ',' : true

		inc++

	}

	return string + ')'

}






const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
}




const identify = obj => {
	let id = 'id: '
	if( typeof obj === 'string' ) return id + obj
	if( obj.name ) return id + 'name: ' + obj.name
	if( obj.type ) return id + 'type: ' + obj.type
	return '(unknown id)'
}




export {
	rgb_to_hex,
	random_hex,
	random_rgb,
	capitalize,
	identify,
	sleep,
}

