export const validatePhoneNumber = (phoneNumber) => {
  const raw = phoneNumber || "";
  const nine = raw.replace(/\D/g, "").replace(/^0+/, ""); // normalize to local 9 digits
  const startsWith4 = nine.startsWith("4");
  console.log("startsWith4:", startsWith4); // optional debug

  if (!/^\d{9}$/.test(nine)) return null; // must be exactly 9 digits
  if (!startsWith4) return null; // must start with '4' (AU mobiles)

  return `+61${nine}`;
};

export const validateSignupForm = (contact) => {
  const { firstName, lastName, email, phone, password, confirmPassword } =
    contact;

  switch (true) {
    case !firstName.trim():
      return "Please enter your first name.";
    case !lastName.trim():
      return "Please enter your last name.";
    case !email.trim():
      return "Please enter your email address.";
    case !password:
      return "Please enter your password.";
    case !confirmPassword:
      return "Please confirm your password.";
    case password !== confirmPassword:
      return "Passwords do not match.";
    case !validatePhoneNumber(phone):
      return "Enter 9 digits without the leading 0 and starting with 4 (e.g. 411234567).";
    default:
      return null;
  }
};

export const validateLoginForm = (email, password) => {
  if (!email.trim()) return "Please enter your email address.";
  if (!password.trim()) return "Please enter your password.";
  return null;
};

export const loginErrorMessage = (error) => {
  const code = error.code;

  switch (code) {
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/popup-closed-by-user":
      return "Sign-in was cancelled.";
    case "auth/invalid-verification-code":
      return "Invalid SMS code. Please try again.";
    case "auth/missing-verification-code":
      return "Please enter the SMS verification code.";
    default:
      return "Sign-in failed. Please try again.";
  }
};

export const authErrorMessage = (error) => {
  const code = error.code;

  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Try logging in.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/missing-email":
      return "Please enter your email address.";
    case "auth/missing-password":
      return "Please enter your password.";
    default:
      return "Something went wrong creating your account.";
  }
};
