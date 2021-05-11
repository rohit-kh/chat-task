async function postData(url, data, method) {
	// Default options are marked with *
	const response =  await fetch(url, {
	  method: method, // *GET, POST, PUT, DELETE, etc.
	  headers: {
		'Content-Type': 'application/json'
	  },
	  redirect: 'follow', // manual, *follow, error
	  referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	  body: JSON.stringify(data) // body data type must match "Content-Type" header
	});
	return await response.json();
  }
