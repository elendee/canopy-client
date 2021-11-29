
import env from '../env.js'
import hal from '../utilities/hal.js'
import Spinner from '../utilities/spinner.js'

import BROKER from '../utilities/EventBroker.js'

const spinner = new Spinner({
	src: '/resource/media/spinner.gif'
})


let bound = 0
let packet, SOCKET 

const init = () => {

	spinner.show()

	SOCKET = new WebSocket( env.WS_URL )

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
				console.log('100+ faulty socket messages', msg )
				SOCKET.bad_messages = 0
			}
			console.log('failed to parse server msg: ', msg )
			return false	

		}

		if( 0 && env.LOCAL && !env.LOG_WS_RECEIVE_EXCLUDES.includes( packet.type ) ) console.log( packet )

		if( bound !== 1 && packet.type !== 'init_entry' ){
			if( bound === 0 ){
				bound = 'limbo'
				if( packet.msg && packet.msg.match(/failed to find/)){
					hal('error', packet.msg, 5000)
				}
				if( packet.type === 'hal' ){
					hal( packet.msg_type, packet.msg, packet.time )
				}
				console.log('user not yet intialized.. packet: ', packet )
			}else{
				// limbo, nothing
			}
			return false
		}


		switch( packet.type ){

			// ALL

			case 'init_entry':
				BROKER.publish('SYSTEM_INIT', packet )
				bound = 1
				break;

			case 'move_tick':
				BROKER.publish('SYSTEM_MOVE_TICK', packet )
				break;

			case 'chat':
				BROKER.publish('RESOLVE_CHAT', packet )
				break;

			default: break
		}

	}




	SOCKET.onerror = function( data ){
		console.log('flag', 'ERROR', data)
		hal('error', 'server error')
	}



	SOCKET.onclose = function( event ){
		hal('error', 'connection closed')
	}


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

