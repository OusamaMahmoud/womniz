import HookFormInput from "../shared/SalonFormInput";
import PasswordInput from "./PasswordInput";

const SalonContactInfo = () => {
  return (
    <>
      <HookFormInput
        maxWidth="max-w-lg"
        type="text"
        icon=""
        label="Salon Name (Arabic)"
        register={"salonNameAr"}
        placeholder="Salon Name.."
      />
      <HookFormInput
        maxWidth="max-w-lg"
        type="text"
        icon=""
        label="Salon Name (English)"
        register={"salonNameEn"}
        placeholder="Salon Name.."
      />
      <HookFormInput
        maxWidth="max-w-lg"
        type="tel"
        icon=""
        label="Phone Number"
        register={"phone"}
        placeholder="Phone..."
      />
      <HookFormInput
        maxWidth="max-w-lg"
        type="email"
        icon=""
        label="Email"
        register={"email"}
        placeholder="write your email..."
      />
      <HookFormInput
        maxWidth="max-w-lg"
        type="text"
        icon=""
        label="Country"
        register={"country"}
        placeholder="write your Country..."
      />
      <HookFormInput
        maxWidth="max-w-lg"
        type="text"
        icon=""
        label="Address"
        register={"address"}
        placeholder="write your address..."
      />
      <PasswordInput />
    </>
  );
};

export default SalonContactInfo;
