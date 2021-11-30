import BROKER from '../utilities/EventBroker.js'

import jam from './jaman.js'

const intervals = {
	tile_ping: false,
}


const init = event => {

	console.log( event )

	const { canopy } = event

	jam( canopy )

	/* 


	'jaman.js' goes here


	*/ 

}


const handle_tiles = event => {

	console.log('handling tiles: ', event )

}


BROKER.subscribe('CANOPY_INIT', init )
BROKER.subscribe('PONG_TILES', handle_tiles )

export default {}