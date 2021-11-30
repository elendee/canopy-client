import BROKER from '../utilities/EventBroker.js'


const init = event => {

	console.log( event )

}


BROKER.subscribe('CANOPY_INIT', init )

export default {}