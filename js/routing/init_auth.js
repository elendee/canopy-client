import hal from '../utilities/hal.js'
import { Modal } from '../utilities/Modal.js'
import fetch_wrap from '../utilities/fetch_wrap.js'
import Spinner from '../utilities/spinner.js'

const spinner = new Spinner({
	src: '/resource/media/spinner.gif',
})


if( location.href.match(/register/)){

	const register_form = document.querySelector('#register')
	const email = document.getElementById('email')
	const handle = document.getElementById('handle')
	const pw = document.getElementById('password')
	// const promo = document.querySelector('input[name=allow_promo]')
	// const conditions = document.querySelector('input[name=read_conditions]')
	// const terms_link = document.getElementById('terms-link')
	// const pw2 = document.getElementById('password2')

	register_form.addEventListener('submit', e => {
		e.preventDefault()
		register().catch( err => { console.log('flag', 'error register: ', err ) } )
	})


	const register = async() => {

		spinner.show()

		const response = await fetch_wrap('/register', 'post', {
	    	email: email.value.trim(),
	    	handle: handle.value.trim(),
	    	password: pw.value.trim(),
	    	// allow_promo: promo.checked,
	    	// conditions: conditions.checked,
		})

		spinner.hide()

		if( response && response.success === true ){
			hal('success', 'success', 1000 )
			setTimeout(function(){
				location.href = '/account'
			}, 1000 )
		}else{
			hal('error', response.msg || 'error registering', 10 * 1000 )
		}

	}



}else if( location.href.match(/login/)){

	const login_form = document.querySelector('#login')

	const forgot = document.querySelector('#forgot a')

	login_form.addEventListener('submit', function(e){
		e.preventDefault()
		login().catch( err => { console.log('flag', 'login err: ', err  ) } ) 
	})

	const login = async() => {

		const response = await fetch_wrap('/login', 'post', {
			email: document.getElementById('email').value.trim(),
			password: document.getElementById('password').value.trim(),
		})

		spinner.show()

		if( response.success ){
			if( localStorage.getItem('cano-creds')){
				location.href = '/admin'
			}else{
				location.href='/account'
			}
		}else{
			hal( 'error', response.msg, 1000 * 10 )
			spinner.hide()
		}

	}


	forgot.addEventListener('click', e => {
		e.preventDefault()
		const modal = new Modal({
			type: 'forgot-pass',
		})
		const form = document.createElement('form')
		const input = document.createElement('input')
		input.type = 'email'
		input.placeholder = 'email to reset: '
		const submit = document.createElement('input')
		submit.type = 'submit'
		submit.value = 'send'
		submit.classList.add('button')

		form.appendChild( input )
		form.appendChild( submit )
		modal.content.appendChild( form )

		document.body.appendChild( modal.ele )

		form.addEventListener('submit', e => {
			e.preventDefault()
			fetch_wrap('/send_confirm', 'post', {
				email: input.value.trim(),
				reset: true,
			})
			.then( res => {
				if( res.success ){
					// hal('success', 'success', 4000 )
					window.location.assign('/await_confirm?e=' + input.value.trim() )
				}else{
					hal('error', res.msg || 'failed to send', 5000 )
					console.log( res )
				}
			})
			.catch( err => {
				hal('error', err.msg || 'failed to send', 5000 )
				console.log( err )
			})
		})
	})	


	

}
