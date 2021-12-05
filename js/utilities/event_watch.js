import hal from './hal.js'




const event_nodes = {}

const logging_events = {}











// build DOM

const node_container = document.createElement('div')
node_container.innerHTML = '<h4 title="[Event name] toggles all logging.\n[Slider] is duration of popup.\n[Checkbox] is console logging.">event watcher</h4>'
node_container.id = 'node-container'
document.body.appendChild( node_container )




// functions

const refresh_events = packet => {
	const { type } = packet
	if( !event_nodes[ type ] ){
		event_nodes[ type ] = build_event_node( type )
		toggle_logging( event_nodes[ type ], false )
		node_container.appendChild( event_nodes[ type ] )
	}
}


const toggle_logging = ( node, state ) => {
	const rawval = node.querySelector('input[type=range]').value
	const type = node.getAttribute('data-type')

	logging_events[ type ] = {
		logging: state,
		duration: ( rawval * 1000 ) / 5,
		'console': node.querySelector('input[type=checkbox]').checked,
	}

	hal('success', ( state ? 'STARTED' : 'STOPPED' ) + ' logging ' + type, 2000 )
	if( state ){
		node.classList.add('active')
	}else{
		node.classList.remove('active')
	}
}





const build_event_node = type => {

	const node = document.createElement('div')
	node.classList.add('event-node')
	node.setAttribute('data-type', type )

	const clickspan = document.createElement('span')
	clickspan.innerHTML = type
	clickspan.title = 'toggle all logging for ' + type 
	clickspan.addEventListener('click', () => {
		toggle_logging( node, !node.classList.contains('active') )
	})
	node.appendChild( clickspan )

	let console_log = document.createElement('input')
	console_log.type = 'checkbox'
	console_log.title = 'log to console'
	console_log.addEventListener('change', e => {
		logging_events[ type ].console = console_log.checked
		hal('success', console_log.checked ? 'logging ' + type + ' to console' : 'stopped logging ' + type + ' to console')
	})
	node.appendChild( console_log )

	let adjuster = document.createElement('input')
	adjuster.type = 'range'
	adjuster.title = 'duration of alerts'
	adjuster.min = 1
	adjuster.max = 50
	adjuster.id = 'adjuster'
	adjuster.addEventListener('click', e => {
		logging_events[ type ].hal = ( adjuster.value / 5 ) * 1000 
	})
	node.appendChild( adjuster )

	logging_events[ type ] = {
		logging: false,
		hal: ( adjuster.value / 5 ) * 1000,
		console: console_log.checked,
	}

	return node

}


// init
event_nodes['private_init_world'] = build_event_node('private_init_world')
node_container.appendChild( event_nodes['private_init_world'] )
event_nodes['private_init_world'].querySelector('input[type=checkbox]').checked = true
event_nodes['private_init_world'].querySelector('input[type=range]').value = 0

toggle_logging( event_nodes['private_init_world'], true )




// export 

const event_watch = packet => {
	if( logging_events[ packet.type ] ){
		// main switch
		if( !logging_events[ packet.type ].logging ) return
		// hal
		if( logging_events[ packet.type ].hal ){ // ( can be 0 / off )
			hal('packet', '<pre>' + JSON.stringify( packet, false, 2 ) + '</pre>', logging_events[ packet.type ].hal )
		}
		// console
		if( logging_events[ packet.type ].console ) console.log( packet )
	}

}


export {
	event_watch,
	refresh_events,
}