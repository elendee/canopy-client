import GLOBAL from '../../GLOBAL.js'
import env from '../../env.js'
import {
	WebGLRenderer,
	sRGBEncoding,
	// PCFSoftShadowMap,
} from '/three-patch/build/three.module.js'
import CAMERA from './CAMERA.js'
import SETTINGS from '../SETTINGS.js'
// import GLOBAL from '../../GLOBAL.js'



const set_renderer = window.set_renderer = ( r, init ) => {
	// if( !init ) return false
	// console.log('set renderer: ', GLOBAL.RENDER.RES_KEY )
	r.setSize( 
		window.innerWidth * ( init ? ( env.LOCAL ? .5 : 1 ) : SETTINGS.resolution ), 
		window.innerHeight * ( init ? ( env.LOCAL ? .5 : 1 ) : SETTINGS.resolution ), 
		false 
	)
}

const renderer = new WebGLRenderer( { 
	antialias: true,
	alpha: true
} )

renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0px";
renderer.domElement.style.left = "0px";
renderer.domElement.style.zIndex = "111";
// renderer.setSize( GAME_W, GAME_H );

renderer.outputEncoding = sRGBEncoding

renderer.setPixelRatio( window.devicePixelRatio )
set_renderer( renderer, true )


renderer.shadowMap.enabled = true
// renderer.shadowMap.type = PCFSoftShadowMap

renderer.domElement.id = 'canopy-canvas'
renderer.domElement.tabindex = 1

renderer.onWindowResize = function(){

	CAMERA.aspect = window.innerWidth / window.innerHeight
	CAMERA.updateProjectionMatrix()

	set_renderer( renderer )

}

window.addEventListener( 'resize', renderer.onWindowResize, false )

if( env.EXPOSE ) window.RENDERER = renderer

// renderer.physicallyCorrectLights = true //accurate lighting that uses the SI unit

// console.log('disabling renderer logs to prevent shader warnings in Firefox')
// renderer.context.getShaderInfoLog = function () { return '' }
// renderer.getContext.getShaderInfoLog = function () { return '' }

document.body.appendChild( renderer.domElement )

export default renderer


