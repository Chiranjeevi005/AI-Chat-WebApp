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
    const sizes = [16, 32, 48];
    const buffers = await Promise.all(
      sizes.map(size => 
        sharp(inputPath)
          .resize(size, size, { fit: 'inside', withoutEnlargement: true })
          .png()
          .toBuffer()
      )
    );
    
    // Write the ICO file
    // ICO format requires a specific header structure
    // For simplicity, we'll create a PNG-based favicon which modern browsers support
    const pngBuffer = await sharp(inputPath)
      .resize(32, 32)
      .png()
      .toBuffer();
    
    fs.writeFileSync(outputPath, pngBuffer);
    console.log('Favicon generated successfully at:', outputPath);
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon();