import { useEffect, useState } from "react";
import avatar from "../../../../public/assets/admin/avatar.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormInput } from "../../reuse-components/FormInput";
import DynamicForm from "../DynamicForm";
import { FaEdit } from "react-icons/fa";
import Dropzone from "../DropZone";
import vendorsService from "../../../services/vendors-service";
import { toast } from "react-toastify";

const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(255, { message: "Name must be at most 255 characters long" })
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Name can only contain letters and spaces",
    }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(8, { message: "Phone number must be at least 8 digits long" })
    .max(20, { message: "Phone number must be at most 20 digits long" })
    .regex(/^\+?\d+$/, {
      message: "Phone number can only contain digits and an optional leading +",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password must be at most 50 characters long" }),
  contactName: z
    .string()
    .min(3, { message: "Contact name must be at least 3 characters long" })
    .max(255, { message: "Contact name must be at most 255 characters long" }),
  hQAdress: z
    .string()
    .min(3, { message: "HQ address must be at least 3 characters long" })
    .max(255, { message: "HQ address must be at most 255 characters long" }),
  shippingAdress: z
    .string()
    .min(3, { message: "Shipping address must be at least 3 characters long" })
    .max(255, {
      message: "Shipping address must be at most 255 characters long",
    }),
  commission: z.number().min(0).max(100),
  ibanNumber: z
    .string()
    .min(15, { message: "IBAN number must be at least 15 characters long" })
    .max(34, { message: "IBAN number must be at most 34 characters long" })
    .regex(/^[A-Z0-9]+$/, {
      message: "IBAN number can only contain uppercase letters and digits",
    }),
  bankName: z
    .string()
    .min(3, { message: "Bank name must be at least 3 characters long" })
    .max(50, { message: "Bank name must be at most 50 characters long" }),
  bankAccountName: z
    .string()
    .min(3, { message: "Bank account name must be at least 3 characters long" })
    .max(50, {
      message: "Bank account name must be at most 50 characters long",
    }),
  accountNumber: z
    .string()
    .min(5, { message: "Account number must be at least 5 characters long" })
    .max(20, { message: "Account number must be at most 20 characters long" })
    .regex(/^\d+$/, { message: "Account number can only contain digits" }),
  swiftNumber: z
    .string()
    .min(8, { message: "SWIFT number must be at least 8 characters long" })
    .max(11, { message: "SWIFT number must be at most 11 characters long" })
    .regex(/^[A-Z0-9]+$/, {
      message: "SWIFT number can only contain uppercase letters and digits",
    }),
});

export type FormData = z.infer<typeof schema>;
export type OptionType = { label: string; value: string };

const VendorForm = ({
  onModalOpen,
}: {
  onModalOpen: (modelState: boolean) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [imageFileError, setImageFileError] = useState(false);
  const [creatingVendorError, setCreatingVendorError] = useState<string>("");
  const [DynamicCategoriesError, setDynamicCategoriesError] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState<
    { category: string; id: number }[]
  >([]);
  const [legalDocs, setLegalDocs] = useState<FileList>();

  const [commercialRegistration, setCommercialRegistration] =
    useState<FileList>();
  const [vatCertificate, setVATCertificate] = useState<FileList>();
  const [legalDocsError, setLegalDocsError] = useState(false);
  const [commercialRegistrationError, setCommercialRegistrationError] =
    useState(false);
  const [vatCertificateError, setVatCertificateError] = useState(false);
  const [imageFile, setImageFile] = useState<File>({} as File);
  const [isCreatingVendorLoading, setCreatingVendorLoading] =
    useState<boolean>(false);
  const [trigerFetch, setTrigerFetch] = useState<boolean>(false);

  const closeModal = () => {
    onModalOpen(false);
    setPhotoPreview(null);
  };
  const isEmptyObject = (obj: { [key: string]: any }) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };
  useEffect(() => {
    if (!isEmptyObject(imageFile)) {
      setImageFileError(false);
    }
    if (legalDocs) {
      setLegalDocsError(false);
    }
    if (commercialRegistration) {
      setCommercialRegistrationError(false);
    }
    if (vatCertificate) {
      setVatCertificateError(false);
    }
    if (dynamicCategories) {
      setDynamicCategoriesError(false);
    }
  }, [
    imageFile,
    legalDocs,
    commercialRegistration,
    vatCertificate,
    dynamicCategories,
  ]);
  const onSubmit = async (data: FormData) => {
    // Handle inputs that unrelated with Hook Form.

    if (isEmptyObject(imageFile)) {
      setImageFileError(true);
      return;
    }

    if (!legalDocs || legalDocs.length < 1) {
      setLegalDocsError(true);
      return;
    }

    if (!commercialRegistration || commercialRegistration.length < 1) {
      setCommercialRegistrationError(true);
      return;
    }
    if (!vatCertificate || vatCertificate?.length < 1) {
      setVatCertificateError(true);
      return;
    }
    if (!dynamicCategories || dynamicCategories?.length < 1) {
      setDynamicCategoriesError(true);
      return;
    }

    const formData = new FormData();

    formData.append(`name`, data.name);
    formData.append(`email`, data.email);
    formData.append(`password`, data.password);
    formData.append(`phone`, data.phone);
    formData.append(`contact_name`, data.contactName);
    formData.append(`hq_address`, data.hQAdress);
    formData.append(`shipping_address`, data.shippingAdress);
    formData.append(`commission`, `${data.commission}`);
    formData.append(`iban_number`, data.ibanNumber);
    dynamicCategories.map((item, index) => {
      formData.append(`categories[${index}]`, `${item.id}`);
    });

    // Bank Details
    formData.append(`bank_name`, data.bankName);
    formData.append(`bank_account_name`, data.bankAccountName);
    formData.append(`account_number`, data.accountNumber);
    formData.append(`swift_number`, data.swiftNumber);

    // FILES
    formData.append(`image`, imageFile);
    if (legalDocs && legalDocs[0]) {
      formData.append(`legal_docs`, legalDocs[0]);
    }
    if (commercialRegistration) {
      formData.append(`commercial_registration`, commercialRegistration[0]);
    }
    if (vatCertificate) {
      formData.append(`vat_certificate`, vatCertificate[0]);
    }

    try {
      setCreatingVendorLoading(true);
      await vendorsService.create<any>(formData);
      setCreatingVendorLoading(false);
      onModalOpen(false);
      toast.success("Create Vendor Account Successfully!");
      setTrigerFetch(!trigerFetch);
    } catch (error: any) {
      setCreatingVendorError(error.response.data.data.error);
      setCreatingVendorLoading(false);
    }
  };
  // Handle Photo Create
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const vendorFormList = [
    {
      label: "Vendor Name",
      id: "name",
      type: "text",
      error: errors.name,
      register: register,
    },
    {
      label: "Email",
      id: "email",
      type: "email",
      error: errors.email,
      register: register,
    },
    {
      label: "Contact Person Name",
      id: "contactName",
      type: "text",
      error: errors.contactName,
      register: register,
    },
    {
      label: "Phone Number",
      id: "phone",
      type: "tel",
      error: errors.phone,
      register: register,
    },
    {
      label: " HQ Adress",
      id: "hQAdress",
      type: "text",
      error: errors.hQAdress,
      register: register,
    },
    {
      label: "Shipping Adress",
      id: "shippingAdress",
      type: "text",
      error: errors.shippingAdress,
      register: register,
    },
    {
      label: "Commission",
      id: "commission",
      type: "number",
      error: errors.commission,
      register: register,
    },
    {
      label: "Password",
      id: "password",
      type: "password",
      register: register,
      error: errors.password,
    },
  ];
  const bankFormList = [
    {
      label: "Bank name",
      type: "text",
      id: "bankName",
      error: errors.bankName,
      register: register,
    },
    {
      label: "Bank account name",
      type: "text",
      id: "bankAccountName",
      error: errors.bankAccountName,
      register: register,
    },
    {
      label: "Account Number",
      type: "text",
      id: "accountNumber",
      error: errors.accountNumber,
      register: register,
    },
    {
      label: "IBAN Number",
      type: "text",
      id: "ibanNumber",
      error: errors.ibanNumber,
      register: register,
    },
    {
      label: " SWIFT Number",
      type: "text",
      id: "swiftNumber",
      error: errors.swiftNumber,
      register: register,
    },
  ];

  return (
    <div className="modal modal-open tracking-wide ">
      <div className="modal-box max-w-4xl px-10 ">
        <h3 className="font-bold text-2xl text-left my-10">Add New Vendor</h3>
        <div className="flex flex-col justify-center items-center my-8 shadow-md p-6">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-36 h-36 object-cover rounded-full"
            />
          ) : (
            <img src={avatar} alt="avatar" />
          )}
          <p className="mt-3">
            {" "}
            {imageFileError && (
              <p className="text-red-600 text-lg tracking-wider">
                Image File iS Required!
              </p>
            )}
          </p>
        </div>
        {creatingVendorError && (
          <p className="text-lg text-red-500 p-2 my-2">{creatingVendorError}</p>
        )}
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="shadow-xl p-8">
          <div className="py-4 grid grid-cols-1 lg:grid-cols-2 gap-8 ">
            {vendorFormList.map((formInput) => (
              <FormInput {...formInput} />
            ))}

            <div className="flex flex-col  w-[100%]">
              <DynamicForm
                onSelectedCategories={(
                  selectedCate: { category: string; id: number }[]
                ) => setDynamicCategories(selectedCate)}
              />
              {DynamicCategoriesError && (
                <p className="text-red-600 text-lg tracking-wider mt-2">
                  Category Filed iS Required!
                </p>
              )}
            </div>

            <label
              className={`absolute top-[230px] z-100 right-[390px] flex items-center   gap-3 rounded-md   bg-gray-50 cursor-pointer`}
            >
              <span className="text-3xl">
                <FaEdit />
              </span>
              <input
                type="file"
                className="file-input file-input-bordered"
                multiple
                hidden
                name="image"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/*  Attach legal Docs */}
          <div>
            <div className="my-10 border-b pb-12">
              <label className="block text-xl font-medium text-gray-700 mb-5">
                Attach legal Docs
              </label>
              <Dropzone
                onSubmit={(files: FileList) => setLegalDocs(files)}
                className="p-2 my-2 border border-neutral-200"
              />
              {legalDocsError && (
                <p className="text-red-600 text-lg tracking-wider">
                  Legal Documents is Required!
                </p>
              )}
            </div>
            <div className="my-10 border-b pb-12">
              <label className="block text-xl font-medium text-gray-700 mb-5">
                Commercial Registration
              </label>
              <Dropzone
                onSubmit={(files: FileList) => setCommercialRegistration(files)}
                className="p-2 my-2 border border-neutral-200"
              />
              {commercialRegistrationError && (
                <p className="text-red-600 text-lg tracking-wider">
                  Commercial Registration is Required!
                </p>
              )}
            </div>
            <div className="my-10 border-b pb-12">
              <label
                htmlFor="legalDocs"
                className="block text-xl font-medium text-gray-700 mb-5"
              >
                VAT Certificate
              </label>
              <Dropzone
                onSubmit={(files: FileList) => setVATCertificate(files)}
                className="p-2 my-2 border border-neutral-200"
              />
              {vatCertificateError && (
                <p className="text-red-600 text-lg tracking-wider">
                  Vat Certificate is Required!
                </p>
              )}
            </div>
          </div>

          <div className="my-4 shadow-md p-6">
            <h1 className="text-xl p-2">Bank Details</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {bankFormList.map((bankInput) => (
                <FormInput {...bankInput} />
              ))}
            </div>
          </div>

          <div className="modal-action flex justify-around items-center right-80 ">
            <button
              type="submit"
              className={`btn px-10 lg:px-20 bg-[#577656] hover:bg-[#5c825b] text-white`}
            >
              {isCreatingVendorLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                `Submit`
              )}
            </button>
            <button
              className={`btn bg-transparent px-10 lg:px-20`}
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorForm;
