function rgbToYIQ({r, g, b}) {
    const color = ((r*299) + (g*587) + (b*114)) / 1000;
    if (isNaN(color)) {
        return '#fff'
    }

    return color;
}

function hexToRgb(hex) {
    if(!hex || hex === '') {
        return undefined;
    }

    const result = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/i.exec(hex)

    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    }
}

export function contrast(colorHex) {
    if (colorHex === undefined) {
        return '#000';
    }

    try {
        const rgb = hexToRgb(colorHex);

        if (rgb === undefined) {
            return '#000';
        }

        return rgbToYIQ(rgb) >= 128 ? '#000': '#fff';
    } catch (error) {
        console.error(error);
        return '#000'
    }
}

export function randomColor() {
    const letters = '0123456789ABCDEF';

    return generateColor(letters)
}

export function randomLightColor() {
    const letters = '789ABCDEF';

    return generateColor(letters)

}

function generateColor(letters) {
    let color = '';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}