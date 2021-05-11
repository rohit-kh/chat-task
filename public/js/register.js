const registrationForm = document.querySelector('form')

registrationForm.addEventListener('submit', (e) => {
	e.preventDefault()
	const name = document.querySelector('.name').value
	const email = document.querySelector('.email').value
	const password = document.querySelector('.password').value
	postData('apis/users', {
		name: name,
		email: email,
		password: password
	}, 'POST')
	.then(response => {
		if (response.status) {
			alert('Account created successfully');
			window.location = 'login'
		} else {
			throw new Error('Something went wrong');
		}
	}).catch(err => {
		alert(err);
	});


	// console.log('testing', search.value)
})

