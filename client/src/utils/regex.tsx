export const isValidEmail = (email: string): boolean => {
    let regExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return regExp.test(email);
};

export const isNumber = (text: string): boolean => {
    const regExp = /^[0-9+]*$/;
    return regExp.test(text);
};