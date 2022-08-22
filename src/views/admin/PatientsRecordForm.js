import React from "react";

// components
import AddRecordForm from "components/Cards/AddRecordForm.js";

export default function PatientsRecordForm() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-12/12 px-4">
          <AddRecordForm />
        </div>
      </div>
    </>
  );
}
