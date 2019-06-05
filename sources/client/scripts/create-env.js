const fs = require('fs')

if (process.env.CONTEXT && process.env.CONTEXT === 'deploy-preview') {
  const reviewId = process.env.REVIEW_ID
  console.log(`Deploy preview #${reviewId} build detected. Setting an environment variable for the associated heroku instance of this preview.`)
  const deployServerPreviewUrl = `https://street-of-age-pr-${reviewId}.herokuapp.com/`
  fs.writeFileSync('./.env', `VUE_APP_SOCKET_ENDPOINT=${deployServerPreviewUrl}`)
  console.log(`Successfully written env file! ${deployServerPreviewUrl} will be used for backend.`)
}
