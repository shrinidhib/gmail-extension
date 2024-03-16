
function authenticateOAuth(callback) {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
        }
        callback(token);
    });
}

// Call the function to authenticate with OAuth
authenticateOAuth(token => {
    fetchEmails(token)
    // Use the token to make authenticated requests to the Gmail API
});

function fetchEmails(token) {
    fetch('https://www.googleapis.com/gmail/v1/users/me/messages?q=in:inbox', {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("data: ", data)
        const emailIds = data.messages.map(message => message.id);
        fetchEmailBodies(emailIds, token);
    })
    .catch(error => {
        console.error('Error fetching emails:', error);
    });
}

function fetchEmailBodies(emailIds, token) {
    console.log(emailIds)
    emailIds.forEach(emailId => {
        fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log("Data in meail body: ", data)
            let binData=data.payload.parts[0].body.data
            binData.replace('-','+').replace('_','/')
            // const emailBody = Buffer.alloc(
            //     binData.data.length,
            //     binData.data,
            //     "base64"
            //   ).toString();
            binData=decodeURIComponent(binData)
            console.log("decoded uri: ", binData)
            const emailBody = atob(binData); // Decode base64 encoded email body
            console.log("email body: ", emailBody)
        })
        .catch(error => {
            console.error('Error fetching email body:', error);
        });
    });
}
