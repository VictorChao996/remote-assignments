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
    //計算各個字元出現的次數
    const numUppercase = (password.match(/[A-Z]/g) || []).length;
    const numLowercase = (password.match(/[a-z]/g) || []).length;
    const numNumbers = (password.match(/[0-9]/g) || []).length;
    const numSymbols = (password.match(/[~`!@#$%^&*()_+={[}\]|:;"'<,>.?/]/g) || []).length;
    
    //統計出現的type個數，至少需要出現三種以上的字元。
    let typeCheck = 0;
    if(numUppercase !== 0)
        typeCheck++;
    if(numLowercase !== 0)
        typeCheck++;
    if(numNumbers !== 0)
        typeCheck++;
    if(numSymbols !== 0)
        typeCheck++;
    
    console.log("🚀 ~ file: validate.js:37 ~ validatePassword ~ typeCheck:", typeCheck)
    if (typeCheck < 3) {
      return false;
    }
    // if (password.length < 8 || password.length > 32) {
    //   return false;
    // }
    return true;
  };
   
module.exports = {validateName, validateEmail, validatePassword};