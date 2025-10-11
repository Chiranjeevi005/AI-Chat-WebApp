const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
  try {
    const inputPath = path.join(__dirname, 'public', 'assets', 'logo.png');
    const outputPath = path.join(__dirname, 'public', 'favicon.ico');
    
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.error('Logo file not found at:', inputPath);
      return;
    }
    
    // Generate multiple sizes for the favicon
    const sizes = [16, 24, 32, 48, 64];
    const buffers = await Promise.all(
      sizes.map(size => 
        sharp(inputPath)
          .resize(size, size, { fit: 'inside', withoutEnlargement: true })
          .png()
          .toBuffer()
      )
    );
    
    // Create ICO file with multiple sizes
    // ICO header
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // Reserved
    header.writeUInt16LE(1, 2); // Icon type
    header.writeUInt16LE(sizes.length, 4); // Number of images
    
    // ICO directory entries
    const dirEntries = [];
    let offset = 6 + sizes.length * 16; // Header + directory entries
    
    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];
      const buffer = buffers[i];
      const entry = Buffer.alloc(16);
      
      entry.writeUInt8(size === 256 ? 0 : size, 0); // Width
      entry.writeUInt8(size === 256 ? 0 : size, 1); // Height
      entry.writeUInt8(0, 2); // Color palette
      entry.writeUInt8(0, 3); // Reserved
      entry.writeUInt16LE(1, 4); // Color planes
      entry.writeUInt16LE(32, 6); // Bits per pixel
      entry.writeUInt32LE(buffer.length, 8); // Image size
      entry.writeUInt32LE(offset, 12); // Image offset
      
      dirEntries.push(entry);
      offset += buffer.length;
    }
    
    // Combine all parts
    const icoBuffer = Buffer.concat([header, ...dirEntries, ...buffers]);
    
    // Write the ICO file
    fs.writeFileSync(outputPath, icoBuffer);
    console.log('Favicon generated successfully at:', outputPath);
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon();