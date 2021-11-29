import GLOBAL from '../GLOBAL.js'
import hal from '../utilities/hal.js'
import fetch_wrap from '../utilities/fetch_wrap.js'


const attempt_confirm = () => {

	const queries = location.search ? location.search.replace('?', '').split('&') : []

	const creds = window.creds = {}

	for( let pair of queries ){
		pair = pair.split('=')
		creds[ pair[0]] = pair[1]
	}

	if( !creds.e || !creds.k ){
		console.log('invalid creds', creds )
		return
	}

	fetch_wrap('/confirm_account', 'post', {
		email: creds.e,
		ck: creds.k,
		q: location.search,
	})
	.then( res => {
		if( res && res.success ){
			hal("success", 'successfully confirmed', 3 * 1000 )
			setTimeout(() => {
				location.assign('/account')
			}, 1000 )
		}else{
			if( res && res.msg && res.msg.match(/too long/)){
				localStorage.setItem('cano-overlapsed', JSON.stringify({
					msg: `You waited more than ${ GLOBAL.CONFIRM_MINUTES } minutes to respond.  Please click the resend button to get a new link`,
					stamp: Date.now(),
				}))
			}
			location.assign('/await_confirm')
			// hal('error', res.msg || 'failed to login' )
		}
		console.log( res )
	})
	.catch( err => {
		hal('error', res.msg || 'failed to login - <a href="/await_confirm">click here to send a new code</a>' )
		console.log( err )
	})


}


attempt_confirm()