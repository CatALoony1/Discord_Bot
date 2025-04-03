const sharp = require('sharp');
const axios = require('axios');

async function gifToPngDataUri(gifUrl) {
  try {
    if (!checkImageType(gifUrl)) return gifUrl;
    const response = await axios({
      url: gifUrl,
      responseType: 'arraybuffer',
    });
    const buffer = response.data;

    const pngBuffer = await sharp(buffer, { animated: true }).png().toBuffer();
    const dataUri = `data:image/png;base64,${pngBuffer.toString('base64')}`;

    return dataUri;
  } catch (error) {
    console.error(`Fehler bei der Konvertierung: ${error}`);
    return gifUrl;
  }
}

async function getContentType(url) {
  try {
    const response = await axios.head(url);
    const contentType = response.headers['content-type'];
    return contentType;
  } catch (error) {
    console.error('Fehler beim Abrufen des Content-Type:', error);
    return null;
  }
}

async function checkImageType(url) {
  const contentType = await getContentType(url);
  if (contentType) {
    if (contentType === 'image/gif') {
      console.log('Der Link verweist auf ein GIF.');
      return true;
    } else if (contentType === 'image/png') {
      console.log('Der Link verweist auf ein PNG.');
      return false;
    } else {
      console.log('Der Link verweist auf ein anderes Bildformat:', contentType);
      return false;
    }
  } else {
    return false;
  }
}


module.exports = gifToPngDataUri;