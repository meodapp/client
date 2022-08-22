import React from "react";

// components

import PatientsTable from "../../components/Cards/PatientsTable";

export default function Tables() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <PatientsTable />
        </div>
      </div>
    </>
  );
}
