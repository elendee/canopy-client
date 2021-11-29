
import env from '../env.js'
import hal from '../utilities/hal.js'
// import ui from '../utilities/ui.js'
import fetch_wrap from '../utilities/fetch_wrap.js'

const content = document.querySelector('#content')



const resend = document.querySelector('#resend-confirm .button')
resend.addEventListener('click', () => {
	fetch_wrap('/send_confirm_mail', 'post', {})
	.then( res => {
		console.log( res )
		if( res && res.success ){
			hal('success', 'email sent', 5 * 1000 )
		}else{
			hal('error', res.msg || 'error sending reset', 5 * 1000 )
		}
	})
	.catch( err => {
		console.log( err )
		hal('error', err.msg || 'error sending reset', 5 * 1000 )
	})
})




// const form = document.createElement("form")
// form.classList.add('auth-form')
// form.id = 'await'
// form.autocomplete = true
// content.appendChild( form )


// const email = document.createElement('input')
// email.type = 'email'
// email.name = 'email'
// email.classList.add('input')
// email.placeholder = 'email'
// const confirm = document.createElement('input')
// confirm.name = 'confirm'
// confirm.type = 'text'
// confirm.classList.add('input')
// confirm.placeholder = 'confirmation code'
// form.appendChild( email )
// form.appendChild( confirm )

// const submit = document.createElement('input')
// submit.classList.add('button')
// submit.type = 'submit'
// submit.value = 'submit'

// form.appendChild( submit )

// form.onsubmit = e => {

// 	e.preventDefault()

// 	spinner.show()

// 	fetch_wrap('/confirm_account', 'post', {
// 		email: email.value.trim(),
// 		confirm_code: confirm.value.trim(),
// 	})
// 	.then( res => {
// 		if( res.success ){
// 			location.href = '/hangar'
// 		}else{
// 			hal('error', res.msg || 'failed to confirm', 10 * 1000)
// 		}
// 		spinner.hide()
// 	})
// 	.catch( err => {
// 		hal('error', 'error', 10 * 1000)
// 		spinner.hide()
// 	})

// }


// if( location.href.match(/\?e=/) ){
// 	const e = location.href.substr( location.href.indexOf( location.href.match(/\?e=/) ) + 3 )
// 	email.value = e
// }