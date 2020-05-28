export const arraysMatch = <T>(arr1: T[], arr2: T[]) => {
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Check if all items exist and are in the same order
    for (let i = 0; i < arr1.length; i++) {
        if (!isEquivalent(arr1[i], arr2[i])) {
            return false;
        }
    }

    // Otherwise, return true
    return true;
};

export const isEquivalent = (a: any, b: any): boolean => {
    // Create arrays of property names
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
        return false;
    }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < aProps.length; i++) {
        const propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
};
