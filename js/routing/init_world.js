import WS from '../world/WS.js'
import menu from '../world/ui/menu.js'
import { EventNode } from '../utilities/event_watch.js'


// import BROKER from '../utilities/EventBroker.js'





// canopy specific:
const p = new EventNode({
	type: 'private_init_world',
	hal: 0,
	console: true,
})
p.toggle()


menu()

WS.init()










console.log('world')

