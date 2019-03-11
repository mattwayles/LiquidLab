export const validateNewUserInput = (displayName, email, verifyEmail, password, confirmPw) => {
    if (!displayName) {
        return "The username field cannot be blank";
    } else if (displayName.length < 3) {
        return "The username must be at least 3 characters"
    } else if (!email) {
        return "The e-mail field cannot be blank"
    } else if (!verifyEmail) {
        return "The verify e-mail field cannot be blank"
    } else if (email !== verifyEmail) {
        return "The e-mail field must match the verify e-mail field"
    }  else if (!password) {
        return "The password field cannot be blank";
    } else if (!confirmPw) {
        return "The confirm password field cannot be blank";
    } else if (password !== confirmPw) {
        return "The password field must match the confirm password field"
    }

    return null;
};

export const validateLoginInput = (email, password) => {
    if (!email) {
        return "The E-mail field cannot be blank";
    } else if (!password) {
        return "The password field cannot be blank";
    }

    return null;
};