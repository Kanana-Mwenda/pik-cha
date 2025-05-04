// src/utils/validateFileType.js

export function validateFileType(file) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  
    return allowedTypes.includes(file.type);
  }
  