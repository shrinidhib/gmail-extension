
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
            let binData;
            if (!data.payload.parts){
                binData=data.payload.body.data
            
            }
            else{
           
                binData=data.payload.parts[0].body.data
       
            }
            
            if(binData){
                const emailBody=atob(binData.replace(/-/g, '+').replace(/_/g, '/') ); 
                const cleanedEmailBody = emailBody.replace(/\s{2,}/g, ' ').trim();
                const bodyWithoutLinks = cleanedEmailBody.replace(/https?:\/\/[^\s]+/g, '')
                const plaintextBody = bodyWithoutLinks.replace(/<style[^>]*>[\s\S]*?<\/style>|<[^>]+>/gi, '');
                const decodedBody = plaintextBody.replace(/&nbsp;|&zwnj;|&amp;/g, '');
                const regex = /[^\x00-\x7F]/g;
                let cleanedString = decodedBody.replace(regex, "");
                console.log("email body: ", cleanedString)
            }
           
            
        })
        .catch(error => {
            console.error('Error fetching email body:', error);
        });
    });
}
