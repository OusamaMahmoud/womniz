interface Props {
  handleDeleteBtn: () => void;
  handleCancelBtn: () => void;
  isLoading: boolean;
}

const DeletedModel = ({
  handleDeleteBtn,
  handleCancelBtn,
  isLoading,
}: Props) => {
  return (
    <div className="modal-box">
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-center items-center rounded-full bg-[#E2000040] w-20 h-20 mb-6">
          <img src="/assets/deleteModel/triangle.svg" alt="triangle" />
        </div>
        <p className="text-xl font-bold mb-6">Are you sure?</p>
        <p className="text-center max-w-96 text-[#000000B2] text-lg font-normal mb-12">
          This action cannot be undone. All values associated with this field
          will be lost
        </p>
        <button
          className="btn bg-[#E20000B2] px-36 mb-2"
          disabled={isLoading}
          onClick={handleDeleteBtn}
        >
          {isLoading ? " Deleting..." : " Delete"}
        </button>
        <div className="modal-action m-0">
          <button className="btn  px-36" onClick={handleCancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletedModel;
