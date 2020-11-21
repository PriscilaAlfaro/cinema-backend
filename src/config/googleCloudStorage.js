const Cloud = require('@google-cloud/storage');

const { Storage } = Cloud;

function storage() {
  return new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: {
      client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
  });
}

module.exports = { storage };
