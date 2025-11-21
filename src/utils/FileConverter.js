/**
 * Converts a File object (like from an <input type="file">) into a byte array and Base64 string.
 * @param {File} file - The file selected by the user.
 * @returns {Promise<{ byteArray: Uint8Array, base64String: string }>}
 */

export const convertFileToBytes = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject("No file provided");
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            const byteArray = new Uint8Array(arrayBuffer);

        // Convert to Base64 string //
            const base64String = btoa(
                new Uint8Array(arrayBuffer)
                    .reduce((data, byte) => data + String.fromCharCode(byte), "")
            );

            resolve({ byteArray, base64String });
        };

        reader.onerror = (err) =>  reject(err);

        reader.readAsArrayBuffer(file);
    });
};

/**
 * Converts Base64 string back to a file and triggers download
 * @param {string} base64String - The Base64 encoded file data
 * @param {string} fileName - The name of the file to download
 */
export const downloadFileFromBase64 = (base64String, fileName) => {
    try {
        // Decode Base64 to binary string
        const binaryString = atob(base64String);
        
        // Convert binary string to byte array
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Create Blob from byte array
        const blob = new Blob([bytes], { type: "application/octet-stream" });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error downloading file:", error);
        throw error;
    }
};
