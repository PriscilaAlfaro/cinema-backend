const Cloud = require('@google-cloud/storage');
const { format } = require('util');

const { Storage } = Cloud;

const storage = process.env.GOOGLE_CLOUD_BUCKET && new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});

const bucket = storage && storage.bucket(process.env.GOOGLE_CLOUD_BUCKET);

const uploadImagesToGoogleCloud = async (files) => {
  if (!bucket) {
    return [];
  }
  const promises = [];

  files.forEach((file) => {
    const originalname = `img-${file.originalname}`;
    const { buffer } = file;
    const blob = bucket.file(originalname);

    const promise = new Promise((resolve, reject) => {
      const blobStream = blob.createWriteStream();

      blobStream.on('finish', async () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET}/${blob.name}`
        );
        resolve(publicUrl);
      });

      blobStream.on('error', (error) => {
        reject(error);
      });

      blobStream.end(buffer);
    });

    promises.push(promise);
  });

  const filePaths = await Promise.all(promises);

  return filePaths;
};

module.exports = { uploadImagesToGoogleCloud };
