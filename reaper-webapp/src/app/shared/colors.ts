/**
 * Returns the value of a base expression taken to a specified power.
 * @param color The color in the format of #000000
 * @returns The brightness value
 */
export const brightness = (color: string) => {
    if (color.length === 7) {
        color = color.substring(1);
    }

    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    return Math.sqrt(r * r * .241 + g * g * .691 + b * b * .068);
};


export const isDark = (color: string): boolean => {
    const val = brightness(color);
    return val < 130;
};

