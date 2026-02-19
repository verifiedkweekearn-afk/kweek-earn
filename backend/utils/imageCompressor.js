const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

/**
 * Compress an image file using Jimp (pure JavaScript)
 * @param {string} inputPath - Path to input image
 * @param {string} outputPath - Path to save compressed image (optional)
 * @param {Object} options - Compression options
 * @returns {Promise<string>} - Path to compressed image
 */
const compressImage = async (inputPath, outputPath = null, options = {}) => {
  try {
    // Set default options
    const width = options.width || 1200;
    const quality = options.quality || 80; // Jimp quality 0-100

    // Generate output path if not provided
    if (!outputPath) {
      const parsed = path.parse(inputPath);
      outputPath = path.join(parsed.dir, `${parsed.name}-compressed${parsed.ext}`);
    }

    // Read image with Jimp
    const image = await Jimp.read(inputPath);
    
    // Resize if needed (maintain aspect ratio)
    if (image.bitmap.width > width) {
      image.resize(width, Jimp.AUTO);
    }

    // Set quality and save
    await image.quality(quality).writeAsync(outputPath);

    // Get file sizes for logging
    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const savings = originalSize > 0 ? ((originalSize - compressedSize) / originalSize * 100).toFixed(1) : 0;

    console.log(`✅ Image compressed: ${path.basename(inputPath)}`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`   Compressed: ${(compressedSize / 1024).toFixed(2)} KB`);
    console.log(`   Savings: ${savings}%`);

    return outputPath;
  } catch (error) {
    console.error('❌ Image compression error:', error);
    throw error;
  }
};

/**
 * Compress image buffer and return buffer
 * @param {Buffer} inputBuffer - Image buffer
 * @param {Object} options - Compression options
 * @returns {Promise<Buffer>} - Compressed image buffer
 */
const compressBuffer = async (inputBuffer, options = {}) => {
  try {
    const width = options.width || 1200;
    const quality = options.quality || 80;

    // Read image from buffer
    const image = await Jimp.read(inputBuffer);
    
    // Resize if needed
    if (image.bitmap.width > width) {
      image.resize(width, Jimp.AUTO);
    }

    // Set quality and get buffer
    image.quality(quality);
    return await image.getBufferAsync(Jimp.MIME_JPEG);
  } catch (error) {
    console.error('❌ Buffer compression error:', error);
    throw error;
  }
};

/**
 * Validate image file
 * @param {string} filePath - Path to image file
 * @returns {Promise<boolean>} - True if valid image
 */
const validateImage = async (filePath) => {
  try {
    const image = await Jimp.read(filePath);
    return !!(image.bitmap.width && image.bitmap.height);
  } catch (error) {
    return false;
  }
};

/**
 * Get image metadata
 * @param {string} filePath - Path to image file
 * @returns {Promise<Object>} - Image metadata
 */
const getImageMetadata = async (filePath) => {
  try {
    const image = await Jimp.read(filePath);
    return {
      width: image.bitmap.width,
      height: image.bitmap.height,
      size: fs.statSync(filePath).size
    };
  } catch (error) {
    console.error('❌ Metadata error:', error);
    return null;
  }
};

module.exports = {
  compressImage,
  compressBuffer,
  validateImage,
  getImageMetadata
};
