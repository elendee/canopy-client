import BROKER from '../utilities/EventBroker.js'

import jam from './jaman.js'

import {
	sleep,
} from '../utilities/lib.js'

const intervals = {
	tile_ping: false,
}


const init = async( event ) => {

	console.log( event )

	const { canopy } = event

	hal('success', 'received canopy...', 5 * 1000 )
	await sleep(1000)
	hal('success', 'seeding canopy:  ' + canopy.name, 5 * 1000 )
	await sleep( 1000 )

	hal('standard', '<pre style="text-align: left">' + JSON.stringify(canopy, false, 2 ) + '</pre>')

	jam( canopy )

}


const handle_tiles = event => {

	console.log('handling tiles: ', event )

}


BROKER.subscribe('CANOPY_INIT', init )
BROKER.subscribe('PONG_TILES', handle_tiles )

export default {}