export function stringToSlug(str: string) {
    if (str) {
        str = str.trim(); // Remove leading and trailing whitespace
        str = str.toLowerCase(); // Convert to lowercase
        str = str.replace(/[^a-zA-Z0-9]+/g, '-'); // Replace non-alphanumeric characters with hyphens
        str = str.replace(/-{2,}/g, '-'); // Replace multiple consecutive hyphens with a single hyphen
        str = str.replace(/^-|-$/g, ''); // Remove leading and trailing hyphens
        return str;
    }
}
