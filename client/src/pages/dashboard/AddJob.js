import React from "react";
import { FormRow, FormRowSelect, Alert } from "../../components";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/DashboardFormPage";

const AddJob = () => {
    const {
        isEditing,
        showAlert,
        displayAlert,
        position,
        company,
        jobLocation,
        jobType,
        jobTypeOptions,
        status,
        statusOptions,
        handleChange,
        clearValues,
        isLoading,
        createJob,
        editJob
    } = useAppContext();

    const handleJobInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        handleChange({ name, value });
        console.log(`${name}: ${value}`);
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!position || !company || !jobLocation) {
            displayAlert();
            return;
        }
       if(isEditing){
            editJob();
            return;
       }
        createJob();
    }

    return (
        <Wrapper>
            <form className="form">
                <h3>{isEditing ? "Edit job" : "Add job"}</h3>
                {showAlert && <Alert />}
                <div className="form-center">
                    {/* Position */}
                    <FormRow type="text" name="position" value={position} handleChange={handleJobInput} />
                    {/* Company */}
                    <FormRow type="text" name="company" value={company} handleChange={handleJobInput} />
                    {/* Location */}
                    <FormRow type="text" labelText="Job location" name="jobLocation" value={jobLocation} handleChange={handleJobInput} />
                    {/* Job type */}
                    <FormRowSelect name="jobType" labelText="Job type" value={jobType} handleChange={handleJobInput} list={jobTypeOptions} />
                    {/* Job status */}
                    <FormRowSelect name="status" value={status} handleChange={handleJobInput} list={statusOptions} />
                    <div className="btn-container">
                        <button type="submit" className="btn btn-block submit-btn" onClick={handleSubmit} disabled={isLoading}>
                            Submit
                        </button>
                        <button className="btn btn-block clear-btn" onClick={(e) => {
                            e.preventDefault();
                            clearValues();
                        }}>
                            Clear
                        </button>
                    </div>

                </div>
            </form>
        </Wrapper>);
}

export default AddJob;