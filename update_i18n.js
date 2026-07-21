import fs from 'fs';

const filePath = './src/i18n.js';
let content = fs.readFileSync(filePath, 'utf8');

const newEnKeys = `
      "authLoginSubtitle": "Enter your email and password to access your account",
      "email": "Email",
      "emailAddress": "Email Address",
      "password": "Password",
      "confirmPassword": "Confirm Password",
      "forgotPassword": "Forgot password?",
      "forgotPasswordTitle": "Forgot Password",
      "forgotPasswordSubtitle": "Enter your email address and we'll send you a reset link",
      "orContinueWith": "Or continue with",
      "newCustomer": "New customer?",
      "register": "Register",
      "createAccount": "Create an account",
      "createAccountSubtitle": "Enter your information to create your account",
      "name": "Name",
      "alreadyHaveAccount": "Already have an account?",
      "sendResetLink": "Send Reset Link",
      "rememberPassword": "Remember your password?",
      "resetPassword": "Reset Password",
      "resetPasswordSubtitle": "Enter your new password",
      "newPassword": "New Password",
      "useDifferentEmail": "Use a different email",
`;

const newArKeys = `
      "authLoginSubtitle": "أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك",
      "email": "البريد الإلكتروني",
      "emailAddress": "عنوان البريد الإلكتروني",
      "password": "كلمة المرور",
      "confirmPassword": "تأكيد كلمة المرور",
      "forgotPassword": "هل نسيت كلمة المرور؟",
      "forgotPasswordTitle": "نسيت كلمة المرور",
      "forgotPasswordSubtitle": "أدخل عنوان بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين",
      "orContinueWith": "أو تابع باستخدام",
      "newCustomer": "زبون جديد؟",
      "register": "تسجيل",
      "createAccount": "إنشاء حساب",
      "createAccountSubtitle": "أدخل معلوماتك لإنشاء حسابك",
      "name": "الاسم",
      "alreadyHaveAccount": "لديك حساب بالفعل؟",
      "sendResetLink": "إرسال رابط التعيين",
      "rememberPassword": "هل تتذكر كلمة المرور؟",
      "resetPassword": "إعادة تعيين كلمة المرور",
      "resetPasswordSubtitle": "أدخل كلمة المرور الجديدة",
      "newPassword": "كلمة المرور الجديدة",
      "useDifferentEmail": "استخدم بريداً إلكترونياً مختلفاً",
`;

const newFrKeys = `
      "authLoginSubtitle": "Entrez votre e-mail et votre mot de passe pour accéder à votre compte",
      "email": "E-mail",
      "emailAddress": "Adresse e-mail",
      "password": "Mot de passe",
      "confirmPassword": "Confirmez le mot de passe",
      "forgotPassword": "Mot de passe oublié ?",
      "forgotPasswordTitle": "Mot de passe oublié",
      "forgotPasswordSubtitle": "Entrez votre adresse e-mail et nous vous enverrons un lien de réinitialisation",
      "orContinueWith": "Ou continuer avec",
      "newCustomer": "Nouveau client ?",
      "register": "S'inscrire",
      "createAccount": "Créer un compte",
      "createAccountSubtitle": "Entrez vos informations pour créer votre compte",
      "name": "Nom",
      "alreadyHaveAccount": "Vous avez déjà un compte ?",
      "sendResetLink": "Envoyer le lien de réinitialisation",
      "rememberPassword": "Vous vous souvenez de votre mot de passe ?",
      "resetPassword": "Réinitialiser le mot de passe",
      "resetPasswordSubtitle": "Entrez votre nouveau mot de passe",
      "newPassword": "Nouveau mot de passe",
      "useDifferentEmail": "Utiliser un autre e-mail",
`;

if(content.includes('"language": "Language"')) {
    content = content.replace('"language": "Language"', '"language": "Language",\\n' + newEnKeys);
} else {
    console.log("Failed to find EN language key");
}

if(content.includes('"language": "اللغة"')) {
    content = content.replace('"language": "اللغة"', '"language": "اللغة",\\n' + newArKeys);
} else {
    console.log("Failed to find AR language key");
}

if(content.includes('"language": "Langue"')) {
    content = content.replace('"language": "Langue"', '"language": "Langue",\\n' + newFrKeys);
} else {
    console.log("Failed to find FR language key");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('i18n.js updated successfully');
