export const extractFromText = (text: string, regex: RegExp) => {
    const extracted = text.match(regex);
    return extracted[extracted.length - 1]
}