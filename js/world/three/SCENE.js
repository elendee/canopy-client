

import env from '../../env.js'
import GLOBAL from '../../GLOBAL.js'
import { 
	Scene, 
	Color, 
	FogExp2, 
	AxesHelper 
} from '/three-patch/build/three.module.js'


const scene = new Scene()

if( env.EXPOSE ) window.SCENE = scene

// if( GLOBAL.RENDER.BACKGROUND ){
// 	scene.background = new Color( GLOBAL.RENDER.BACKGROUND )
// }
// scene.fog = new FogExp2( 0x000000, .00001 )

if( env.AXES ){
	let axesHelper = new AxesHelper( 5 )
	scene.add( axesHelper )
}

scene.needs_render = false

export default scene

