console.log('Client side javascript file is loaded!')

const registrationForm = document.querySelector('form')

registrationForm.addEventListener('submit', (e) => {
	e.preventDefault()
	const email = document.querySelector('.email').value
	const password = document.querySelector('.password').value
	postData('apis/users/login', {
		email: email,
		password: password
	}, 'POST')
	.then((response) => {
		if (response.token) {
			window.location = 'chat'
		} else {
			throw new Error('Please enter valid credential');
		}
	}, 'POST').catch(err => {
		alert(err);
	});
})