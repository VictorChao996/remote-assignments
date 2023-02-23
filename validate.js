//TODO: 完成下面三個function

const validateName = (name) => {
    const regex = /^[A-Za-z0-9]+$/;
    return regex.test(name);
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

const validatePassword = (password) => {
    const numUppercase = (password.match(/[A-Z]/g) || []).length;
    const numLowercase = (password.match(/[a-z]/g) || []).length;
    const numNumbers = (password.match(/[0-9]/g) || []).length;
    const numSymbols = (password.match(/[~`!@#$%^&*()_+={[}\]|:;"'<,>.?/]/g) || []).length;
    const numCharacterTypes = numUppercase + numLowercase + numNumbers + numSymbols;
    if (numCharacterTypes < 3) {
      return false;
    }
    // if (password.length < 8 || password.length > 32) {
    //   return false;
    // }
    return true;
  };

module.exports = {validateName, validateEmail, validatePassword};