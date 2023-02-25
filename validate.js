/**
 * @author: Victor
 * * This file is a collection of the validation functions.
 */

/**
 * - 檢查name是否符合格式
 * @param {String} name 
 * @returns {Boolean} true if 符合格式
 */
const validateName = (name) => {
    const regex = /^[A-Za-z0-9]+$/;
    return regex.test(name);
  };

  /**
   * - 檢查email是否符合格式
   * @param {String} email 
   * @returns {Boolean} true if 符合格式
   */
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  /**
   * - 檢查password是否符合格式
   * @param {String} password 
   * @returns {Boolean} true if 符合格式
   */
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
   

  /**
   * - 檢查DateString是否有符合格式 **[Sun, 06 Nov 1994 08:49:37 GMT]**
   * @param {String} dateString 
   * @return {Boolean} true if dateString format is valid
   */
const validateDateFormat = function(dateString) {
  const dateFormat = /^\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} \w{3}$/;
  return dateFormat.test(dateString);
}

/**
 * - 用於檢查User Sign Up API 的格式
 * @param {String} name 
 * @param {String} email 
 * @param {String} password 
 * @returns 
 */
const checkInputFormat = function(name, email, password){
  //若有一string為空，則回傳false
  if(validateName(name) && validateEmail(email) && validatePassword(password)){
    return true;
  }
  return false;
}


module.exports = {validateName, validateEmail, validatePassword, validateDateFormat,checkInputFormat};