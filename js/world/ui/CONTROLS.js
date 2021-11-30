import {
	OrbitControls,
} from '/three-patch/examples/jsm/controls/OrbitControls.js'

import CAMERA from '../three/CAMERA.js'
import RENDERER from '../three/RENDERER.js'


const controls = new OrbitControls( CAMERA, RENDERER.domElement );
controls.keys = {};


export default controls