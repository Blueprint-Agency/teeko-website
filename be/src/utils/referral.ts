import crypto from "crypto";

/**
 * Generates a random alphanumeric referral code.
 * @param length The length of the code (default is 4).
 * @returns A random string of the specified length.
 */
export const generateReferralCode = (length: number = 4): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, chars.length);
        result += chars[randomIndex];
    }
    return result;
};
