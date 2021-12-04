import {
	xhr_file,
	bind_form,
} from '../utilities/file_handler.js'

import Spinner from '../utilities/Spinner.js'

import GLOBAL from '../GLOBAL.js'




const uploads = document.querySelectorAll('.script-upload')

const spinner = new Spinner()



for( const u of uploads ){
	bind_form( u, {
		upload_size: GLOBAL.UPLOAD_SIZE,
		type: u.getAttribute('data-upload-type'),
		clearance: localStorage.getItem('canopy-clearance'),
	}, spinner )
}

