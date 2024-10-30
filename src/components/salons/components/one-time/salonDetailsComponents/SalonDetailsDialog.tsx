import { FieldValues, Path } from "react-hook-form";

interface DialogProps<T> {
  id: string;
  header: string;
  children: React.ReactNode;
}

const SalonDetailsDialog = <T extends FieldValues>({
  id,
  header,
  children,
}: DialogProps<T>) => {
  return (
    <dialog id={`my_modal_${id}`} className="modal">
      <div className="modal-box">
        <h1 className="text-xl font-semibold">{header}</h1>
        <div className="grid grid-cols-2 place-items-center">{children}</div>
      </div>
    </dialog>
  );
};

export default SalonDetailsDialog;
