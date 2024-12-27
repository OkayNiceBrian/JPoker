export const abbreviateChips = (chips: number): string => {
    let chipString: string = chips.toString();
    let abbreviation: string = "";

    if (chipString.length > 3 && chipString.length < 7) {
        let lastIndex = chipString.length - 3;
        abbreviation = `${chipString.substring(0, lastIndex)}${chipString[lastIndex] !== '0' && `.${chipString[lastIndex]}`}k`;
    } else if (chipString.length >= 7) {
        let lastIndex = chipString.length - 6;
        abbreviation = `${chipString.substring(0, lastIndex)}${chipString[lastIndex] !== '0' && `.${chipString[lastIndex]}`}m`;
    } else {
        abbreviation = chipString;
    }

    return abbreviation;
}