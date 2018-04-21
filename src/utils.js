const compact = (array) => {
    let resIndex = 0;
    const result = [];

    if (array == null) {
        return result;
    }

    for (const value of array) {
        if (value) {
            result[resIndex++] = value;
        }
    }

    return result;
};

const range = (start, end) => {
    let index = -1;
    let length = Math.max(end - start, 0);
    const result = new Array(length);

    while (length--) {
        result[++index] = start;
        start += 1;
    }

    return result;
};

export const utils = { compact, range };
