// Simple placeholder for image upload. 
// In a real app, this would upload to S3/Cloudinary and return the URL.
export const uploadImage = async (file: any): Promise<string> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return a mock URL or the file path if local
    return `https://placehold.co/600x400?text=Uploaded+Image`;
};
