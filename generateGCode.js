import {Jimp} from 'jimp';
import fs from 'fs';

const WORK_AREA_MM = 100;

const RESOLUTION_MM_PER_PIXEL = 1;

async function generateGCode(imagePath) {
    try {
  
        const image = await Jimp.read(imagePath);
  
        const imageWidthPx = Math.floor(WORK_AREA_MM / RESOLUTION_MM_PER_PIXEL);
        const imageHeightPx = Math.floor(WORK_AREA_MM / RESOLUTION_MM_PER_PIXEL);
        const colorInt = rgbaToInt(255, 0, 0, 255);
        console.log("RGBA to Int:", colorInt);
    
  
        console.log(`Resizing image to ${imageWidthPx}x${imageHeightPx} pixels...`);
        console.log("Available methods:", Object.keys(image));
        console.log(`Resizing image to ${imageWidthPx}x${imageHeightPx} pixels...`);
  
        if (isNaN(imageWidthPx) || isNaN(imageHeightPx) || imageWidthPx <= 0 || imageHeightPx <= 0) {
            throw new Error(`Invalid resize dimensions: ${imageWidthPx}x${imageHeightPx}`);
        }
  
  
        image.resize({w:imageWidthPx, h:imageHeightPx}); 
        image.greyscale(); 
  
        let gcode = `
        G21 ; Set units to mm
        G90 ; Absolute positioning
        G0 Z5 ; Raise laser
        G0 X0 Y0 ; Move to start
        `;
        console.log(image.bitmap.width);
  
  
        for (let y = 0; y < image.bitmap.height; y++) {
            let lineGcode = `G1 Y${(y * RESOLUTION_MM_PER_PIXEL).toFixed(3)} F1000\n`;
            let engraving = false;
  
            for (let x = 0; x < image.bitmap.width; x++) {
                let pixel = image.getPixelColor(x, y); 
                let r = (pixel >> 16) & 0xff;
                let g = (pixel >> 8) & 0xff;
                let b = pixel & 0xff;
        
                let grayscaleValue = (r + g + b) / 3; 
        
                let isBlack = grayscaleValue < 128; 
        
                if (isBlack) {
                    if (!engraving) {
                        lineGcode += `G1 X${(x * RESOLUTION_MM_PER_PIXEL).toFixed(3)} S255 ; Laser ON\n`;
                        engraving = true;
                    }
                } else {
                    if (engraving) {
                        lineGcode += `G0 X${(x * RESOLUTION_MM_PER_PIXEL).toFixed(3)} ; Laser OFF\n`;
                        engraving = false;
                    }
                }
            }
        
            if (engraving) {
                lineGcode += "G0 Z5 ; Raise laser\n";
            }
            gcode+=lineGcode; 
        }
        gcode+="G0 Z5 ; Finish engraving\n";
        return gcode;  
    } catch (error) {
        console.error("Error processing image:", error);
        return null;
    }
  }
  function rgbaToInt(r, g, b, a) {
    return ((a & 0xff) << 24) | ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);
  }
  
module.exports = { generateGCode };
