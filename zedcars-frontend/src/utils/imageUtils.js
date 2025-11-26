// Utility to get the first image URL from JSON string or single URL
export const getFirstImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  try {
    // Try to parse as JSON array
    const urls = JSON.parse(imageUrl);
    return Array.isArray(urls) && urls.length > 0 ? urls[0] : null;
  } catch {
    // If not JSON, treat as single URL
    return imageUrl;
  }
};

// Utility to get all image URLs from JSON string or single URL
export const getAllImageUrls = (imageUrl) => {
  if (!imageUrl) return [];
  
  try {
    // Try to parse as JSON array
    const urls = JSON.parse(imageUrl);
    return Array.isArray(urls) ? urls : [imageUrl];
  } catch {
    // If not JSON, treat as single URL
    return [imageUrl];
  }
};
