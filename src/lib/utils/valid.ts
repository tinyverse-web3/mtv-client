// import { validate } from 'secure-password-validator';
import passwordValidator from 'password-validator';
// Create a schema
const schema = new passwordValidator();

// Add properties to it
schema
  .is()
  .min(8) // Minimum length 8
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits() // Must have at least 2 digits
  .has()
  .symbols() // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(['Passw0rd', 'Password123', '123456']);

// export const validatePassword = async (pwd: string) => {
//   console.log(pwd);
//   console.log(schema.validate(pwd));
//   return schema.validate(pwd);
// };

export function validatePassword(password: string) {
  // 8到20位
  let reg = /^.{8,20}$/;
  if (!reg.test(password)) {
    return {
      value: false,
      msg: '密码长度为8-20位',
    };
  }

  let hasUpperCase = /[A-Z]/.test(password);
  let hasLowerCase = /[a-z]/.test(password);
  let hasDigits = /\d/.test(password);
  let hasSymbols = /[!@#$%^&*_~+]/.test(password);
  let typeCount = 0;
  if (hasUpperCase) typeCount++;
  if (hasLowerCase) typeCount++;
  if (hasDigits) typeCount++;
  if (hasSymbols) typeCount++;
  if (typeCount < 2) {
    return {
      value: false,
      msg: '密码必须包含大小写字母、数字、特殊字符中的两种',
    };
  }
  return {
    value: true,
    msg: '',
  };
}
export const validEmail = async (pwd: string) => {
  return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
    pwd,
  );
};
