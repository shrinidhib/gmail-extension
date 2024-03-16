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
    console.log('OAuth token:', token);
    // Use the token to make authenticated requests to the Gmail API
});