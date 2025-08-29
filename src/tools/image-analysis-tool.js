// src/tools/image-analysis-tool.js - Advanced Image Analysis Tool
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { getColorFromURL, palette, prominent } from 'color-thief-node';
import imageSize from 'image-size';

class ImageAnalysisTool {
  constructor() {
    this.name = 'imageAnalysis';
    this.description = 'Analyze images for colors, dimensions, format, quality, and visual characteristics';
    this.parameters = {
      imagePath: { 
        type: 'string', 
        description: 'Path to the image file to analyze' 
      },
      analysisType: { 
        type: 'string', 
        description: 'Type of analysis: basic, colors, quality, full', 
        default: 'full' 
      },
      extractPalette: { 
        type: 'boolean', 
        description: 'Extract color palette from image', 
        default: true 
      },
      colorCount: { 
        type: 'number', 
        description: 'Number of colors to extract in palette', 
        default: 5 
      }
    };
  }

  async execute(params) {
    try {
      const { imagePath, analysisType = 'full', extractPalette = true, colorCount = 5 } = params;

      // Validate image file exists
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Image file not found: ${imagePath}`);
      }

      const result = {
        filePath: imagePath,
        fileName: path.basename(imagePath),
        timestamp: new Date().toISOString(),
        analysis: {}
      };

      // Basic file information
      const stats = fs.statSync(imagePath);
      result.analysis.fileInfo = {
        size: stats.size,
        sizeFormatted: this.formatFileSize(stats.size),
        lastModified: stats.mtime,
        extension: path.extname(imagePath).toLowerCase()
      };

      // Image dimensions and format
      try {
        const dimensions = imageSize(imagePath);
        result.analysis.dimensions = {
          width: dimensions.width,
          height: dimensions.height,
          aspectRatio: (dimensions.width / dimensions.height).toFixed(2),
          format: dimensions.type,
          megapixels: ((dimensions.width * dimensions.height) / 1000000).toFixed(2)
        };
      } catch (error) {
        console.warn(`Could not get image dimensions: ${error.message}`);
        result.analysis.dimensions = { error: 'Could not determine dimensions' };
      }

      // Advanced analysis with Sharp
      if (analysisType === 'basic') {
        return result;
      }

      try {
        const image = sharp(imagePath);
        const metadata = await image.metadata();
        
        result.analysis.metadata = {
          format: metadata.format,
          space: metadata.space,
          channels: metadata.channels,
          depth: metadata.depth,
          density: metadata.density,
          hasAlpha: metadata.hasAlpha,
          hasProfile: metadata.hasProfile,
          isProgressive: metadata.isProgressive,
          compression: metadata.compression
        };

        // Quality assessment
        if (analysisType === 'quality' || analysisType === 'full') {
          result.analysis.quality = await this.assessImageQuality(image, metadata);
        }

        // Color analysis
        if (extractPalette && (analysisType === 'colors' || analysisType === 'full')) {
          result.analysis.colors = await this.analyzeColors(imagePath, colorCount);
        }

        // Statistical analysis
        if (analysisType === 'full') {
          result.analysis.statistics = await this.getImageStatistics(image);
        }

      } catch (error) {
        console.warn(`Advanced analysis failed: ${error.message}`);
        result.analysis.advancedAnalysis = { error: error.message };
      }

      return result;

    } catch (error) {
      console.error('Image analysis failed:', error);
      throw new Error(`Image analysis failed: ${error.message}`);
    }
  }

  async assessImageQuality(image, metadata) {
    try {
      const stats = await image.stats();
      
      // Calculate sharpness using Laplacian variance
      const { data } = await image
        .greyscale()
        .raw()
        .toBuffer({ resolveWithObject: true });
      
      const sharpness = this.calculateSharpness(data, metadata.width, metadata.height);
      
      return {
        sharpness: {
          score: sharpness,
          assessment: this.assessSharpness(sharpness)
        },
        brightness: {
          mean: stats.channels.map(ch => ch.mean),
          assessment: this.assessBrightness(stats.channels[0].mean)
        },
        contrast: {
          std: stats.channels.map(ch => ch.std),
          assessment: this.assessContrast(stats.channels[0].std)
        },
        overall: this.getOverallQuality(sharpness, stats.channels[0].mean, stats.channels[0].std)
      };
    } catch (error) {
      return { error: `Quality assessment failed: ${error.message}` };
    }
  }

  async analyzeColors(imagePath, colorCount) {
    try {
      const colors = await palette(imagePath, colorCount);
      const dominantColor = await prominent(imagePath);
      
      return {
        palette: colors.map(color => ({
          rgb: color,
          hex: this.rgbToHex(color),
          hsl: this.rgbToHsl(color)
        })),
        dominant: {
          rgb: dominantColor,
          hex: this.rgbToHex(dominantColor),
          hsl: this.rgbToHsl(dominantColor)
        },
        colorCount: colors.length
      };
    } catch (error) {
      return { error: `Color analysis failed: ${error.message}` };
    }
  }

  async getImageStatistics(image) {
    try {
      const stats = await image.stats();
      return {
        channels: stats.channels.map((ch, idx) => ({
          channel: idx,
          min: ch.min,
          max: ch.max,
          sum: ch.sum,
          squaresSum: ch.squaresSum,
          mean: ch.mean,
          stdev: ch.std,
          minX: ch.minX,
          minY: ch.minY,
          maxX: ch.maxX,
          maxY: ch.maxY
        })),
        isOpaque: stats.isOpaque,
        entropy: stats.entropy
      };
    } catch (error) {
      return { error: `Statistics calculation failed: ${error.message}` };
    }
  }

  calculateSharpness(data, width, height) {
    // Simplified Laplacian variance calculation
    let variance = 0;
    let mean = 0;
    const total = width * height;
    
    // Calculate mean
    for (let i = 0; i < data.length; i++) {
      mean += data[i];
    }
    mean /= total;
    
    // Calculate variance
    for (let i = 0; i < data.length; i++) {
      variance += Math.pow(data[i] - mean, 2);
    }
    
    return variance / total;
  }

  assessSharpness(sharpness) {
    if (sharpness > 1000) return 'Very Sharp';
    if (sharpness > 500) return 'Sharp';
    if (sharpness > 100) return 'Moderate';
    if (sharpness > 50) return 'Soft';
    return 'Blurry';
  }

  assessBrightness(brightness) {
    if (brightness > 200) return 'Very Bright';
    if (brightness > 150) return 'Bright';
    if (brightness > 100) return 'Normal';
    if (brightness > 50) return 'Dark';
    return 'Very Dark';
  }

  assessContrast(contrast) {
    if (contrast > 60) return 'High Contrast';
    if (contrast > 40) return 'Good Contrast';
    if (contrast > 20) return 'Low Contrast';
    return 'Very Low Contrast';
  }

  getOverallQuality(sharpness, brightness, contrast) {
    let score = 0;
    
    // Sharpness contribution (40%)
    if (sharpness > 500) score += 40;
    else if (sharpness > 100) score += 30;
    else if (sharpness > 50) score += 20;
    else score += 10;
    
    // Brightness contribution (30%)
    if (brightness >= 100 && brightness <= 180) score += 30;
    else if (brightness >= 80 && brightness <= 200) score += 20;
    else score += 10;
    
    // Contrast contribution (30%)
    if (contrast > 40) score += 30;
    else if (contrast > 20) score += 20;
    else score += 10;
    
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  }

  formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  rgbToHex([r, g, b]) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  rgbToHsl([r, g, b]) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return [
      Math.round(h * 360),
      Math.round(s * 100),
      Math.round(l * 100)
    ];
  }
}

export default ImageAnalysisTool;