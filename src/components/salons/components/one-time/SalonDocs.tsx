import React, { useState } from "react";
import Dropzone from "../../../vendors/DropZone";

const SalonDocs = () => {
  const [legalDocs, setLegalDocs] = useState<FileList>();
  const [commercialRegistration, setCommercialRegistration] =
    useState<FileList>();
  const [vatCertificate, setVATCertificate] = useState<FileList>();

  return (
    <div>
      <div className="my-10 border-b pb-12 xl:w-[500px]">
        <label className="block text-xl font-medium text-gray-700 mb-5">
          Attach legal Docs
        </label>
        <Dropzone
          onSubmit={(files: FileList) => setLegalDocs(files)}
          className="p-2 my-2 border border-neutral-200"
        />
      </div>
      <div className="my-10 border-b pb-12 xl:w-[500px]">
        <label className="block text-xl font-medium text-gray-700 mb-5">
          Commercial Registration
        </label>
        <Dropzone
          onSubmit={(files: FileList) => setCommercialRegistration(files)}
          className="p-2 my-2 border border-neutral-200"
        />
      </div>
      <div className="my-10 border-b pb-12 xl:w-[500px]">
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
      </div>
    </div>
  );
};

export default SalonDocs;
