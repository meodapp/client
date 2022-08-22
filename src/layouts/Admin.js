import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";

// views
import Dashboard from "views/admin/Dashboard.js";
import Maps from "views/admin/Maps.js";
import PatientsRecordForm from "views/admin/PatientsRecordForm.js";
import Tables from "views/admin/Tables.js";
import Footer from "../components/Footers/Footer";
import PatientRecords from "../components/Cards/PatientRecords";
import AddPatientForm from "../components/Cards/AddPatientForm";

import {Amplify} from 'aws-amplify';
import {withAuthenticator} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './login.css';

import awsExports from '../aws-exports';
import {LoginHeader} from "../components/Headers/LoginHeader";
import {LoginFooter} from "../components/Footers/LoginFooter";

Amplify.configure(awsExports);

function Admin() {
  return (
    <>
      {/*<Sidebar />*/}
      <div className="relative bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div  style={{minHeight: "80vh"}}>
            <Switch>
              <Route path="/admin/maps" exact component={Maps} />
              <Route path="/patient/:id/record/add" exact component={PatientsRecordForm} />
              <Route path="/patient/:patientId/record/:id" exact component={Dashboard} />
              <Route path="/home" exact component={Tables} />
              <Route path="/patient/add" exact component={AddPatientForm} />
              <Route path="/patient/:id" exact component={PatientRecords} />
              <Redirect from="/admin" to="/admin/dashboard" />
            </Switch>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default withAuthenticator(Admin, {
  components: {
    Header: LoginHeader,
    Footer: LoginFooter
  }
});
