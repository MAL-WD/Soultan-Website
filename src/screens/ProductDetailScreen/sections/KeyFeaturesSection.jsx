import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { ImageLightbox } from "../../../components/ImageLightbox";

export const KeyFeaturesSection = ({
  product,
  isArabic,
  qty,
  setQty,
  addToCartHandler,
  buyNowHandler,
}) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const images = product.images?.length > 0 ? product.images : [{ url: product.image || "/placeholder.jpg" }];

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxNavigate = (direction) => {
    if (direction === 'prev') {
      setLightboxIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    } else {
      setLightboxIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <section className="flex flex-col items-center gap-6 pt-10 pb-20 px-6 lg:px-12 w-full">
      <div className="flex flex-col max-w-[1344px] items-start gap-6 w-full">
        <div className="flex flex-col items-start gap-2 w-full">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-[11px] rounded-[14px] min-h-10 text-brand-color-main hover:bg-transparent"
          >
            <ChevronLeftIcon className={`w-[17px] h-[17px] ${isArabic ? 'rotate-180' : ''}`} />
            <span className="font-button-button-default font-[number:var(--button-button-default-font-weight)] text-[length:var(--button-button-default-font-size)] tracking-[var(--button-button-default-letter-spacing)] leading-[var(--button-button-default-line-height)] [font-style:var(--button-button-default-font-style)]">
              {isArabic ? "رجوع" : "Go back"}
            </span>
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center gap-14 w-full">
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-20 w-full">
            <div className="flex flex-col items-start gap-12 flex-1 w-full">
              <div className="flex items-start gap-1 w-full">
                <div className="flex items-start justify-center gap-[25px] flex-1">
                  <div className="flex flex-col items-center gap-6 flex-1 w-full">
                    <div 
                      className="w-full h-[400px] lg:h-[609px] border border-solid border-[#dfdfdf] rounded-3xl overflow-hidden bg-contain bg-no-repeat bg-center transition-all duration-500 cursor-pointer hover:opacity-90"
                      style={{ backgroundImage: `url(${images[selectedImage]?.url})` }}
                      onClick={() => handleImageClick(selectedImage)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleImageClick(selectedImage)}
                    />

                    <div className="flex items-center justify-between w-full">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-10 h-10 rounded-full p-0"
                        onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                      >
                        <ChevronLeftIcon className={`w-[17px] h-[17px] text-brand-color-main ${isArabic ? 'rotate-180' : ''}`} />
                      </Button>

                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {images.map((img, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setSelectedImage(index);
                              handleImageClick(index);
                            }}
                            className={`w-[60px] h-[60px] bg-contain bg-no-repeat bg-center cursor-pointer transition-all rounded-lg ${
                              selectedImage === index
                                ? "border-2 border-solid border-brand-color-accent"
                                : "border border-transparent opacity-70 hover:opacity-100"
                            }`}
                            style={{ backgroundImage: `url(${img.url})` }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                setSelectedImage(index);
                                handleImageClick(index);
                              }
                            }}
                          />
                        ))}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-10 h-10 rounded-full p-0 bg-brand-color-main-hover-light"
                        onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                      >
                        <ChevronRightIcon className={`w-[17px] h-[17px] text-brand-color-main ${isArabic ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-6 w-full">
                <h2 className="w-full font-heading-heading-4 font-[number:var(--heading-heading-4-font-weight)] text-font-font-color-head text-[length:var(--heading-heading-4-font-size)] tracking-[var(--heading-heading-4-letter-spacing)] leading-[var(--heading-heading-4-line-height)] [font-style:var(--heading-heading-4-font-style)]">
                  {isArabic ? "الوصف" : "Description"}
                </h2>

                <p className="font-paragraph-body font-[number:var(--paragraph-body-font-weight)] text-font-font-color-body text-[length:var(--paragraph-body-font-size)] tracking-[var(--paragraph-body-letter-spacing)] leading-[var(--paragraph-body-line-height)] [font-style:var(--paragraph-body-font-style)]">
                  {isArabic ? product.description_ar : product.description_en}
                </p>
              </div>
            </div>

            <aside className="flex flex-col w-full lg:w-[400px] items-start gap-10">
              <div className="flex items-start gap-2 w-full">
                <div className="flex flex-col items-start gap-2 flex-1">
                  <h1 className="mt-[-1.00px] [font-family:'DM_Sans',Helvetica] font-bold text-font-font-color-head text-3xl lg:text-[40px] tracking-[0] leading-tight lg:leading-[48.0px]">
                    {isArabic ? product.name_ar : product.name_en}
                  </h1>

                  <div className="inline-flex items-center gap-4">
                    <p className="w-fit mt-[-1.00px] font-paragraph-body font-[number:var(--paragraph-body-font-weight)] text-font-font-color-body text-[length:var(--paragraph-body-font-size)] tracking-[var(--paragraph-body-letter-spacing)] leading-[var(--paragraph-body-line-height)] whitespace-nowrap [font-style:var(--paragraph-body-font-style)]">
                      {isArabic ? "المرجع:" : "Reference:"} {product.reference || product.sku || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-2">
                <div className="flex items-center gap-4">
                     <p className="w-fit mt-[-1.00px] font-heading-heading-5 font-bold text-brand-color-accent text-2xl lg:text-3xl">
                        {product.price} DA
                    </p>
                    {product.comparePrice > 0 && product.comparePrice > product.price && (
                         <p className="w-fit mt-[-1.00px] font-paragraph-body line-through text-gray-400 text-lg">
                            {product.comparePrice} DA
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                     <div className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {product.stock > 0 ? (isArabic ? "متوفر" : "In Stock") : (isArabic ? "غير متوفر" : "Out of Stock")}
                    </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-10 w-full">
                <div className="flex flex-col items-start gap-6 w-full">
                  {/* Product Options (Pages, Packs, etc.) */}
                  {product.productOptions?.length > 0 && (
                    <div className="flex flex-col max-w-[300px] items-start w-full">
                        <div className="flex flex-col items-start gap-2 w-full">
                        <div className="flex items-center gap-2 w-full">
                            <div className="flex items-start gap-2 flex-1">
                            <label className="flex items-center justify-center w-fit mt-[-1.00px] font-form-form-label font-[number:var(--form-form-label-font-weight)] text-font-font-color-head text-[length:var(--form-form-label-font-size)] tracking-[var(--form-form-label-letter-spacing)] leading-[var(--form-form-label-line-height)] whitespace-nowrap [font-style:var(--form-form-label-font-style)]">
                                {isArabic ? "الخيارات المتوفرة" : "Options"}
                            </label>
                            </div>
                        </div>

                        <Select defaultValue={product.productOptions[0]}>
                            <SelectTrigger className="w-full bg-ui-color-ui-01 border-[#dfdfdf] font-form-form-placeholder font-[number:var(--form-form-placeholder-font-weight)] text-font-font-color-head text-[length:var(--form-form-placeholder-font-size)] tracking-[var(--form-form-placeholder-letter-spacing)] leading-[var(--form-form-placeholder-line-height)] [font-style:var(--form-form-placeholder-font-style)]">
                                <SelectValue placeholder={isArabic ? "اختر الخيار" : "Select option"} />
                            </SelectTrigger>
                            <SelectContent>
                                {product.productOptions.map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        </div>
                    </div>
                  )}

                  {product.availableColors?.length > 0 && (
                    <div className="flex flex-col max-w-[300px] items-start w-full">
                        <div className="flex flex-col items-start gap-2 w-full">
                        <div className="flex items-center gap-2 w-full">
                            <div className="flex items-start gap-2 flex-1">
                            <label className="flex items-center justify-center w-fit mt-[-1.00px] font-form-form-label font-[number:var(--form-form-label-font-weight)] text-font-font-color-head text-[length:var(--form-form-label-font-size)] tracking-[var(--form-form-label-letter-spacing)] leading-[var(--form-form-label-line-height)] whitespace-nowrap [font-style:var(--form-form-label-font-style)]">
                                {isArabic ? "الألوان المتوفرة" : "Colours"}
                            </label>
                            </div>
                        </div>

                        <Select defaultValue={product.availableColors[0]}>
                            <SelectTrigger className="w-full bg-ui-color-ui-01 border-[#dfdfdf] font-form-form-placeholder font-[number:var(--form-form-placeholder-font-weight)] text-font-font-color-head text-[length:var(--form-form-placeholder-font-size)] tracking-[var(--form-form-placeholder-letter-spacing)] leading-[var(--form-form-placeholder-line-height)] [font-style:var(--form-form-placeholder-font-style)]">
                                <SelectValue placeholder={isArabic ? "اختر اللون" : "Select color"} />
                            </SelectTrigger>
                            <SelectContent>
                                {product.availableColors.map(color => (
                                    <SelectItem key={color} value={color}>{color}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        </div>
                    </div>
                  )}

                  <div className="flex flex-col items-start gap-6 w-full mt-4">
                    <div className="inline-flex flex-col items-start">
                      <div className="inline-flex flex-col items-start gap-2">
                        <div className="inline-flex items-center gap-2">
                          <label className="flex items-center justify-center w-fit mt-[-1.00px] font-form-form-label font-[number:var(--form-form-label-font-weight)] text-font-font-color-head text-[length:var(--form-form-label-font-size)] tracking-[var(--form-form-label-letter-spacing)] leading-[var(--form-form-label-line-height)] whitespace-nowrap [font-style:var(--form-form-label-font-style)]">
                            {isArabic ? "الكمية" : "Quantity"}
                          </label>
                        </div>

                        <div className="inline-flex items-center bg-ui-color-ui-01 rounded overflow-hidden border border-solid border-[#dfdfdf]">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={qty <= 1}
                            onClick={() => setQty(prev => prev - 1)}
                            className="h-[38px] w-[38px] rounded-none hover:bg-transparent"
                          >
                            <MinusIcon className="w-[18px] h-[18px] text-font-font-color-body" />
                          </Button>

                          <div className="w-px h-[38px] bg-ui-color-ui-04" />

                          <div className="flex flex-col w-[62px] items-center justify-center">
                            <span className="flex items-center justify-center flex-1 w-2.5 mt-[-1.00px] font-form-form-placeholder font-[number:var(--form-form-placeholder-font-weight)] text-font-font-color-head text-[length:var(--form-form-placeholder-font-size)] text-center tracking-[var(--form-form-placeholder-letter-spacing)] leading-[var(--form-form-placeholder-line-height)] whitespace-nowrap [font-style:var(--form-form-placeholder-font-style)]">
                              {qty}
                            </span>
                          </div>

                          <div className="w-px h-[38px] bg-ui-color-ui-04" />

                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={qty >= product.stock}
                            onClick={() => setQty(prev => prev + 1)}
                            className="h-[38px] w-[38px] rounded-none hover:bg-transparent"
                          >
                            <PlusIcon className="w-[18px] h-[18px] text-font-font-color-body" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 w-full">
                  <Button 
                    onClick={buyNowHandler}
                    disabled={product.stock === 0}
                    className="w-full min-h-[50px] px-6 py-[11px] rounded-[14px] bg-[linear-gradient(134deg,rgba(2,60,18,1)_0%,rgba(2,112,32,1)_100%)] font-button-button-default font-[number:var(--button-button-default-font-weight)] text-font-font-color-inv text-[length:var(--button-button-default-font-size)] tracking-[var(--button-button-default-letter-spacing)] leading-[var(--button-button-default-line-height)] [font-style:var(--button-button-default-font-style)] hover:opacity-90 shadow-lg"
                  >
                    {isArabic ? "شراء الآن" : "Buy now"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={addToCartHandler}
                    disabled={product.stock === 0}
                    className="w-full h-12 px-6 py-[11px] rounded-[14px] border-brand-color-main gap-2 font-button-button-default font-bold text-brand-color-main hover:bg-brand-color-main-hover-light"
                  >
                    {isArabic ? "أضف للسلة" : "Add to cart"}
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={handleLightboxNavigate}
          isArabic={isArabic}
        />
      )}
    </section>
  );
};
