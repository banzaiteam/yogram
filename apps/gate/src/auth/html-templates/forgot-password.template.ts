export const getForgotPasswordTemplate = (
  username: string,
  token: string,
  email: string,
) => {
  let path: string;
  if (process.env.NODE_ENV !== undefined) {
    path = 'http://localhost:3000';
  } else {
    path = 'https://gate.yogram.ru';
  }
  return `<p>Hello ${username},</p>
        <p>Please click the link if you want to change your password. Link will live for 24 hours</p>
        <a href=${path}/api/v1/auth/restore-page/${token}/${email}>update password</a>`;
};
