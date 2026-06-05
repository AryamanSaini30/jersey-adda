const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const uploadSegment = '/upload/';
  const markerIndex = url.indexOf(uploadSegment);

  if (markerIndex === -1) {
    return null;
  }

  let publicIdPart = url.slice(markerIndex + uploadSegment.length);
  publicIdPart = publicIdPart.replace(/^v\d+\//, '');
  publicIdPart = publicIdPart.replace(/\.[a-zA-Z0-9]+$/, '');

  return publicIdPart || null;
}

function uploadImage(file, folder = 'jersey-adda/jerseys') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
}

async function deleteImageByUrl(url) {
  const publicId = extractPublicIdFromUrl(url);

  if (!publicId) {
    return { deleted: false };
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image'
  });

  return {
    deleted: result === 'ok' || result === 'not found'
  };
}

async function deleteImageByPublicId(publicId) {
  if (!publicId || typeof publicId !== 'string') {
    return { deleted: false };
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image'
  });

  return {
    deleted: result === 'ok' || result === 'not found'
  };
}

module.exports = {
  uploadImage,
  deleteImageByUrl,
  deleteImageByPublicId,
  extractPublicIdFromUrl
};