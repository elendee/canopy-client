import hal from './hal.js'


const event_nodes = {}

const logging_events = {}




const css = `
#node-container{
	position: fixed;
	top: 0;
	left: 0;
	color: white;
	z-index: 99;
	border: 1px solid grey;
	background: rgba(255, 255, 255, .1);
	max-height: 100vh;
	overflow-y: auto;
	opacity: .4;
}
#node-container:hover{
	opacity: 1;
}
#node-container h4{
    text-align: center;
}
.event-node{
	padding: 10px;
	cursor: pointer;
	color: grey;
}
.event-node input{
	float: right;
	margin-left: 10px;
}
.event-node.active{
	color: orange;
	font-weight: bold;
}`
const style = document.createElement('style')
style.innerHTML = css
document.head.appendChild( style )


class EventNode {

	constructor( init ){

		init = init || {}

		const en = this

		// values
		en.type = init.type
		en.hal = init.hal
		en.console = init.console

		// DOM
		en.ele = document.createElement('div')
		en.ele.classList.add('event-node')
		en.ele.setAttribute('data-type', en.type )

		en.span = document.createElement('span')
		en.span.innerHTML = en.type
		en.span.title = 'toggle all logging for ' + en.type 
		en.span.addEventListener('click', () => {
			en.toggle()
		})
		en.ele.appendChild( en.span )

		en.console_log = document.createElement('input')
		en.console_log.type = 'checkbox'
		en.console_log.title = 'log to console'
		en.console_log.checked = en.console = init.console
		en.console_log.addEventListener('change', e => {
			en.console = en.console_log.checked
			if( logging_events[ en.type ]){
				hal('success', en.console_log.checked ? 'logging ' + en.type + ' to console' : 'stopped logging ' + en.type + ' to console')
			}
		})
		en.ele.appendChild( en.console_log )

		en.adjuster = document.createElement('input')
		en.adjuster.type = 'range'
		en.adjuster.title = 'duration of alerts'
		en.adjuster.min = 0
		en.adjuster.max = 50
		en.adjuster.id = 'adjuster'
		en.hal = en.adjuster.value = init.hal
		en.adjuster.addEventListener('click', e => {
			en.hal = en.adjuster.value
			if( logging_events[ en.type ] ){
				hal('success', 'duration for ' + en.type + ': ' + en.get_duration(), 2000 )
			}
		})
		en.ele.appendChild( en.adjuster )

		// init
		event_nodes[ en.type ] = this

		node_container.appendChild( en.ele )

	}

	get_duration(){
		return ( this.hal / 5 ) * 1000
	}

	toggle(){
		const state = logging_events[ this.type ]
		if( state ){
			delete logging_events[ this.type ]
		}else{
			logging_events[ this.type ] = true
		}
		hal('success', ( !state ? 'STARTED' : 'STOPPED' ) + ' logging ' + this.type, 2000  )
		this.ele.classList.toggle('active')
	}

}






// functions

const touch_event = packet => {

	const { type } = packet

	if( !event_nodes[ type ] ){
		const node = new EventNode({
			type: type,
			hal: 10,
			console: false
		})
	}

}



// build DOM

const node_container = document.createElement('div')
node_container.innerHTML = '<h4 title="[Event name] toggles all logging.\n[Slider] is duration of popup.\n[Checkbox] is console logging.">event watcher</h4>'
node_container.id = 'node-container'
document.body.appendChild( node_container )








// export 

const event_watch = packet => {

	touch_event( packet )

	if( !logging_events[ packet.type ] ) return 

	// hal
	if( event_nodes[ packet.type ].hal ){ // ( can be 0 / off )
		const duration = event_nodes[ packet.type ].get_duration()
		if( duration ){
			hal('packet', '<pre>' + JSON.stringify( packet, false, 2 ) + '</pre>', duration )
		}
	}
	// console
	if( event_nodes[ packet.type ].console ) console.log( packet )

}


export {
	event_watch,
	EventNode,
}