import React, { useEffect, useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { marked } from "marked";
import DOMPurify from "dompurify";

const TextEditorForReturn = ({
  onHtmlContent,
  localKey,
  prodDesc = "",
  returnPolicy = "",
  lang = "",
}) => {
  const [content, setContent] = useState(() => {
    return localStorage.getItem(localKey) || "";
  });

  useEffect(() => {
    const stripHtmlTags = (html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      return doc.body.textContent || "";
    };

    setContent(stripHtmlTags(prodDesc));
  }, [prodDesc]);

  useEffect(() => {
    if (returnPolicy === "yes" && lang === "english") {
      setContent(
        "We're committed to ensuring your satisfaction with our products. This item is eligible for return within 30 days of purchase, provided it remains unworn, unwashed, and with all original tags attached. To initiate a return, please contact our customer service team or visit our returns portal."
      );
    } else if (returnPolicy === "no" && lang === "english") {
      setContent(
        " Please note that this item is marked as a final sale and is not eligible for return or exchange. We recommend reviewing the product details and sizing information carefully before making your purchase. If you have any questions or need assistance, our customer service team is here to help."
      );
    }

    if (returnPolicy === "yes" && lang === "arabic") {
      setContent(
        "نحن ملتزمون بضمان رضاك عن منتجاتنا. يحق لك إرجاع هذا المنتج خلال 30 يومًا من تاريخ الشراء، بشرط أن يكون غير ملبوس، غير مغسول، وأن تكون جميع العلامات الأصلية مرفقة. لبدء عملية الإرجاع، يرجى التواصل مع فريق خدمة العملاء لدينا أو زيارة بوابة الإرجاع الخاصة بنا"
      );
    } else if (returnPolicy === "no" && lang === "arabic") {
      setContent(
        " رجى ملاحظة أن هذا المنتج مميز كبيع نهائي، ولا يمكن إرجاعه أو استبداله. ننصح بمراجعة تفاصيل المنتج ومعلومات القياس بعناية قبل الشراء. إذا كان لديك أي استفسارات أو تحتاج إلى مساعدة، فإن فريق خدمة العملاء لدينا هنا لمساعدتك"
      );
    }
  }, [returnPolicy]);

  useEffect(() => {
    if (localStorage.getItem(localKey)) {
      setContent(localStorage.getItem(localKey));
    }
  }, [localStorage.getItem(localKey)]);

  const handleChange = (value) => {
    setContent(value);
    localStorage.setItem(localKey, value);
  };

  useEffect(() => {
    const rawHtml = marked(content);
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);
    onHtmlContent(sanitizedHtml);
  }, [content]);

  return (
    <div className="text-editor xl:min-w-[600px]">
      <SimpleMDE value={content} onChange={handleChange} />
    </div>
  );
};

export default TextEditorForReturn;
