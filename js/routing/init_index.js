import Spinner from '../utilities/spinner.js'
import fetch_wrap from '../utilities/spinner.js'
import hal from '../utilities/hal.js'

const spinner = new Spinner({
	src: '/resource/media/spinner.gif'
})

document.querySelectorAll('.nav-link')[0].style.display = 'none'

