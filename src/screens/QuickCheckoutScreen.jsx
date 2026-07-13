import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Phone, CreditCard, ArrowLeft, Send, Copy, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { toast } from 'react-toastify';
import { clearCartItems } from '../slices/cartSlice';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';

const QuickCheckoutScreen = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const { userInfo } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    phone: '',
    address: '',
    notes: '',
    method: 'delivery', // 'delivery' or 'pickup'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [createOrder] = useCreateOrderMutation();

  // CCP and Contact Info - These would ideally come from env vars
  const ccpInfo = {
    number: import.meta.env.VITE_CCP_NUMBER || '003 002 123456789012 34',
    name: import.meta.env.VITE_CCP_NAME || 'Soltane Stationery',
  };
  const contactInfo = {
    phone: import.meta.env.VITE_CONTACT_PHONE || '+213 123 456 789',
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(isArabic ? 'تم النسخ بنجاح' : 'Copied successfully!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || (formData.method === 'delivery' && !formData.address)) {
      toast.error(isArabic ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Format order items for email
    const itemsList = cartItems
      .map((item) => `${isArabic ? item.name_ar : item.name_en} (x${item.quantity}) - ${item.price * item.quantity} DZD`)
      .join('\n');

    const emailData = {
      service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_placeholder',
      template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_placeholder',
      user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key_placeholder',
      template_params: {
        to_name: 'Soltane Admin',
        from_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.method === 'pickup' ? (isArabic ? 'استلام من المتجر' : 'Store Pickup') : formData.address,
        delivery_method: formData.method === 'pickup' ? (isArabic ? 'استلام' : 'Pickup') : (isArabic ? 'توصيل' : 'Delivery'),
        order_details: itemsList,
        total_price: `${totalPrice} DZD`,
        customer_notes: formData.notes || 'No notes',
      },
    };

    try {
      // Save to Database
      await createOrder({
        items: cartItems.map(item => ({
          product: item._id,
          name_en: item.name_en,
          name_ar: item.name_ar,
          quantity: item.quantity,
          price: item.price,
          image: item.images?.[0]?.url
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: "Algeria", // Default or user choice if added later
          street: formData.address || (formData.method === 'pickup' ? 'Store Pickup' : 'N/A')
        },
        paymentMethod: 'cash_on_delivery', // Default for quick checkout
        totalAmount: totalPrice,
        notes: formData.notes
      }).unwrap();

      // Send Email Notification
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        setIsSuccess(true);
        dispatch(clearCartItems());
        toast.success(isArabic ? 'تم إرسال طلبك بنجاح' : 'Order sent successfully!');
      } else {
        // Even if email fails, order is saved in DB
        setIsSuccess(true);
        dispatch(clearCartItems());
        console.warn('Email notification failed but order was saved.');
        toast.success(isArabic ? 'تم حفظ طلبك بنجاح' : 'Order saved successfully!');
      }
    } catch (error) {
      console.error('Order Submission Error:', error);
      toast.error(isArabic ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقاً' : 'Error sending order. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">{isArabic ? 'عربة التسوق فارغة' : 'Your cart is empty'}</h2>
        <Link to="/products">
          <Button className="bg-[#02110c] text-white underline decoration-[#f2c161]">
            {isArabic ? 'العودة للتسوق' : 'Back to Shopping'}
          </Button>
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="border-t-4 border-[#f2c161] shadow-xl overflow-hidden">
          <div className="bg-[#f0fff4] p-8 text-center border-b border-[#c6f6d5]">
            <CheckCircle className="w-16 h-16 text-[#38a169] mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-[#276749] mb-2">
              {isArabic ? 'تم استلام طلبك!' : 'Order Received!'}
            </h1>
            <p className="text-[#2f855a] font-medium">
              {isArabic 
                ? 'سنقوم بالرد عليك في أقرب وقت ممكن.' 
                : 'We will respond as fast as possible.'}
            </p>
          </div>
          
          <CardContent className="p-8 space-y-8">
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 shrink-0" />
              <div>
                <p className="text-yellow-800 font-medium leading-relaxed">
                  {isArabic 
                    ? 'إذا كنت تريد تسريع العملية، يمكنك التواصل معنا مباشرة أو الدفع عبر CCP.'
                    : 'If you want to accelerate the process, you can contact us directly or pay via CCP.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-[#02110c]">
                  <Phone className="w-5 h-5 text-[#f2c161]" />
                  {isArabic ? 'معلومات التواصل' : 'Contact Us'}
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">{isArabic ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'}</p>
                  <p className="text-xl font-bold text-[#02110c]">{contactInfo.phone}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-[#02110c]">
                  <CreditCard className="w-5 h-5 text-[#f2c161]" />
                  {isArabic ? 'الدفع عبر CCP' : 'CCP Payment'}
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 relative group">
                  <p className="text-sm text-gray-500 mb-1">{isArabic ? 'رقم الحساب' : 'Account Number'}</p>
                  <p className="text-lg font-bold text-[#02110c] font-mono mb-2">{ccpInfo.number}</p>
                  <p className="text-sm text-gray-600">{ccpInfo.name}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 text-[#f2c161] hover:text-[#f2c161]/80"
                    onClick={() => copyToClipboard(ccpInfo.number)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link to="/" className="flex-1">
                <Button className="w-full bg-[#02110c] hover:bg-[#02110c]/90 text-white h-12 rounded-xl">
                  {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
                </Button>
              </Link>
              <Link to="/products" className="flex-1">
                <Button variant="outline" className="w-full border-2 border-[#02110c] text-[#02110c] h-12 rounded-xl">
                  {isArabic ? 'تصفح المزيد' : 'Browse More'}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/cart')} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold text-[#02110c]">
          {isArabic ? 'إتمام المعلومات' : 'Complete Your Info'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 bg-white rounded-2xl">
            <CardHeader className="p-8 border-b border-gray-50">
              <CardTitle className="text-xl">
                {isArabic ? 'معلومات التوصيل' : 'Delivery Information'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'يرجى تزويدنا بمعلوماتك لتأكيد الطلب' 
                  : 'Please provide your details to confirm the order'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Method Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setFormData(prev => ({ ...prev, method: 'delivery' }))}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${formData.method === 'delivery' ? 'border-[#f2c161] bg-yellow-50' : 'border-gray-100 bg-gray-50 opacity-60'}`}
                  >
                    <Send className={`w-6 h-6 ${formData.method === 'delivery' ? 'text-yellow-600' : 'text-gray-400'}`} />
                    <span className="font-bold text-sm">{isArabic ? 'توصيل للمنزل' : 'Home Delivery'}</span>
                  </div>
                  <div 
                    onClick={() => setFormData(prev => ({ ...prev, method: 'pickup' }))}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${formData.method === 'pickup' ? 'border-[#f2c161] bg-yellow-50' : 'border-gray-100 bg-gray-50 opacity-60'}`}
                  >
                    <CreditCard className={`w-6 h-6 ${formData.method === 'pickup' ? 'text-yellow-600' : 'text-gray-400'}`} />
                    <span className="font-bold text-sm">{isArabic ? 'استلام من المتجر' : 'Store Pickup'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {isArabic ? 'الاسم الكامل' : 'Full Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#f2c161] focus:border-transparent outline-none transition-all"
                    placeholder={isArabic ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {isArabic ? 'رقم الهاتف' : 'Phone Number'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#f2c161] focus:border-transparent outline-none transition-all"
                    placeholder={isArabic ? 'مثال: 0512345678' : 'e.g., 0512345678'}
                    required
                  />
                </div>

                {formData.method === 'delivery' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-semibold text-gray-700">
                      {isArabic ? 'العنوان الكامل' : 'Full Address'} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#f2c161] focus:border-transparent outline-none transition-all resize-none"
                      placeholder={isArabic ? 'الولاية، الدائرة، البلدية، العنوان...' : 'State, City, Street...'}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {isArabic ? 'ملاحظات إضافية' : 'Additional Notes'}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#f2c161] focus:border-transparent outline-none transition-all resize-none"
                    placeholder={isArabic ? 'أي معلومات إضافية...' : 'Any extra information...'}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 bg-[linear-gradient(339deg,rgba(250,219,157,1)_0%,rgba(242,193,97,1)_56%,rgba(252,221,159,1)_100%)] hover:opacity-90 text-[#02110c] font-bold text-lg rounded-2xl shadow-lg border-0 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#02110c]" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {isArabic ? 'تأكيد الطلب' : 'Confirm Order'}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Summary Section */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border-0 bg-[#02110c] text-white rounded-2xl sticky top-24">
            <CardHeader className="p-8 border-b border-[#ffffff1a]">
              <CardTitle className="text-xl text-[#f2c161]">
                {isArabic ? 'ملخص الطلب' : 'Order Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-start gap-4 text-sm bg-[#ffffff0a] p-3 rounded-lg border border-[#ffffff0d]">
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{isArabic ? item.name_ar : item.name_en}</p>
                      <p className="text-[#ffffff80]">x{item.quantity}</p>
                    </div>
                    <span className="font-bold whitespace-nowrap">{item.price * item.quantity} DZD</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-[#ffffff1a] space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#ffffff80]">{isArabic ? 'المجموع' : 'Total'}</span>
                  <span className="text-2xl font-black text-[#f2c161]">{totalPrice} DZD</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuickCheckoutScreen;
