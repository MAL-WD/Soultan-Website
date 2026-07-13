import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Copy, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const PaymentInstructionsScreen = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  // CCP Account Information - This should come from environment variables or admin settings
  const ccpAccount = {
    number: '003 002 123456789012 34', // Example - should be configured
    name: 'Soltane Stationery',
    bank: 'Baridimob',
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(isArabic ? 'تم النسخ' : 'Copied to clipboard');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Link to="/payment">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isArabic ? 'رجوع' : 'Back to Payment'}
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-[#02110c] mb-2">
          {isArabic ? 'تعليمات الدفع عبر بريديموب' : 'Baridimob Payment Instructions'}
        </h1>
        <p className="text-gray-600">
          {isArabic 
            ? 'يرجى اتباع الخطوات التالية لإتمام عملية الدفع'
            : 'Please follow the steps below to complete your payment'}
        </p>
      </div>

      <div className="space-y-6">
        {/* CCP Account Information */}
        <Card className="border-2 border-[#f2c161]">
          <CardHeader>
            <CardTitle className="text-xl">{t('ccpInfo')}</CardTitle>
            <CardDescription>
              {isArabic 
                ? 'قم بنسخ رقم الحساب وأرسل المبلغ الإجمالي'
                : 'Copy the account number and transfer the total amount'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {isArabic ? 'رقم الحساب (CCP):' : 'CCP Account Number:'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(ccpAccount.number)}
                  className="h-8"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {isArabic ? 'نسخ' : 'Copy'}
                </Button>
              </div>
              <p className="text-2xl font-bold text-[#02110c] font-mono">
                {ccpAccount.number}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-1">
                  {isArabic ? 'اسم الحساب:' : 'Account Name:'}
                </span>
                <p className="text-lg font-semibold">{ccpAccount.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-1">
                  {isArabic ? 'البنك:' : 'Bank:'}
                </span>
                <p className="text-lg font-semibold">{ccpAccount.bank}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'خطوات الدفع' : 'Payment Steps'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 list-decimal list-inside">
              <li className="flex items-start">
                <span className="mr-2 font-bold text-[#f2c161]">1.</span>
                <span>
                  {isArabic 
                    ? 'اذهب إلى أقرب مكتب بريديموب أو استخدم التطبيق'
                    : 'Go to the nearest Baridimob office or use the mobile app'}
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-[#f2c161]">2.</span>
                <span>
                  {isArabic 
                    ? 'أدخل رقم الحساب أعلاه والمبلغ الإجمالي للطلب'
                    : 'Enter the account number above and the total order amount'}
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-[#f2c161]">3.</span>
                <span>
                  {isArabic 
                    ? 'احفظ إيصال الدفع (سوف تحتاجه لاحقاً)'
                    : 'Save the payment receipt (you will need it later)'}
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-[#f2c161]">4.</span>
                <span>
                  {isArabic 
                    ? 'ارجع إلى الموقع وقم برفع صورة إيصال الدفع'
                    : 'Return to the website and upload a photo of the payment receipt'}
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-[#f2c161]">5.</span>
                <span>
                  {isArabic 
                    ? 'سيتم التحقق من الدفع وتجهيز طلبك'
                    : 'Your payment will be verified and your order will be processed'}
                </span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Alert>
          <CheckCircle className="w-4 h-4" />
          <AlertDescription>
            <strong>{isArabic ? 'ملاحظات مهمة:' : 'Important Notes:'}</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>
                {isArabic 
                  ? 'تأكد من إدخال رقم الحساب بشكل صحيح'
                  : 'Make sure to enter the account number correctly'}
              </li>
              <li>
                {isArabic 
                  ? 'احتفظ بإيصال الدفع حتى يتم التحقق'
                  : 'Keep your payment receipt until verification is complete'}
              </li>
              <li>
                {isArabic 
                  ? 'قد يستغرق التحقق من 24 إلى 48 ساعة'
                  : 'Verification may take 24 to 48 hours'}
              </li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Continue Button */}
        <div className="flex gap-4">
          <Link to="/placeorder" className="flex-1">
            <Button className="w-full bg-[#02110c] hover:bg-[#02110c]/90 text-white h-12">
              {isArabic ? 'متابعة إلى رفع الإيصال' : 'Continue to Upload Receipt'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructionsScreen;

