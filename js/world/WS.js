
import env from '../env.js'
import hal from '../utilities/hal.js'
import Spinner from '../utilities/Spinner.js'

import BROKER from '../utilities/EventBroker.js'

const spinner = new Spinner({
	src: '/resource/media/spinner.gif'
})

// if( env.HASHA && env.HASHA === env.HASHB ){ // usually ROUTER will be a global from another script....
// 	window.ROUTER = packet => {
// 		hal('packet', '<pre>' + JSON.stringify( packet, false, 2 ) + '</pre>', 500 )
// 		// console.log('packet: ', packet )
// 	}
// }

let bound = 0
let packet, SOCKET 

const init = () => {

	spinner.show()

	SOCKET = window.SOCKET = new WebSocket( env.WS_URL )

	SOCKET.onopen = function( event ){

		spinner.hide()

		console.log('connected ws' )

	}


	SOCKET.onmessage = function( msg ){

		packet = false

		try{

			packet = JSON.parse( msg.data )

		}catch(e){

			SOCKET.bad_messages++
			if( SOCKET.bad_messages > 100 ) {
				console.log('100+ faulty socket messages detected', msg )
				SOCKET.bad_messages = 0
			}
			console.log('failed to parse server msg: ', msg )
			return false	

		}

		if( window.ROUTER ){
			ROUTER( packet )
		}

		refresh_events( packet )

		if( logging_events.includes( packet.type )){
			hal('packet', '<pre>' + JSON.stringify( packet, false, 2 ) + '</pre>', 500 )
			console.log( packet )
		}

		switch( packet.type ){
			case 'private_init_world':
				window.PLAYER1 = packet.player1
				// console.log( packet )
				break;

			case 'event_types':
				refresh_events()
				break;

			case 'step':

				break;

			default: 
				break;
		}

		// else{
		// 	hal('packet', '<pre>' + JSON.stringify( packet, null, 2 ) + '</pre>')
		// 	// console.log('router not found for packet: ', packet )
		// }
		
	}



	SOCKET.onerror = function( data ){
		console.log('flag', 'ERROR', data)
		hal('error', 'server error')
	}



	SOCKET.onclose = function( event ){
		hal('error', 'connection closed')
	}


}








const node_container = document.createElement('div')
node_container.id = 'node-container'
document.body.appendChild( node_container )

const event_nodes = {}

const logging_events = ['private_init_world']

const refresh_events = packet => {
	const { type } = packet
	if( !event_nodes[ type ] ){
		event_nodes[ type ] = build_event_node( type )
		node_container.appendChild( event_nodes[ type ] )
	}
}


const build_event_node = type => {

	const node = document.createElement('div')
	node.innerHTML = type
	node.classList.add('event-node')
	node.addEventListener('click', () => {
		if( !logging_events.includes( type )){
			logging_events.push( type )
			node.classList.add('active')
			hal('success', 'STARTED logging ' + type, 2000 )
		}else{
			logging_events.splice( logging_events.indexOf( type ), 1 )
			node.classList.remove('active')
			hal('success', 'STOPPED logging ' + type, 2000 )
		}
	})

	return node

}






let send_packet

const send = event => {

	send_packet = event 

	if( SOCKET.readyState === 1 ) SOCKET.send( JSON.stringify( send_packet ))

}



BROKER.subscribe('SOCKET_SEND', send )




export default {
	init: init,
}

