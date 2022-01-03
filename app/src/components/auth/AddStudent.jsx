import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addStudentFields } from "./formFields";
import QRCode from "qrcode";
import Axios from "axios";

const AddStudentSchema = Yup.object().shape({
  firstName: Yup.string().required("Firstname is required"),
  lastName: Yup.string().required("Lastname is required"),
  matricNumber: Yup.string().required("Matric number is Required"),
});

const AddStudent = () => {
  const [error, setError] = useState("");

  const handleAddStudent = async (
    { firstName, lastName, matricNumber, level, course },
    { setSubmitting }
  ) => {
    setSubmitting(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const qrCode = await QRCode.toDataURL(matricNumber);
      await Axios.post(
        "https://3000-copper-damselfly-vwfk70rf.ws-eu25.gitpod.io/api/addstudent",
        { firstName, lastName, matricNumber, level, course, qrCode },
        config
      );
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 xl:px-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 px-12 bg-white py-8 shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-xl sm:text-3xl font-extrabold text-gray-900">
            Add new dummy student
          </h2>
        </div>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            matricNumber: "",
            course: "computer_science",
            level: "100",
          }}
          validationSchema={AddStudentSchema}
          onSubmit={handleAddStudent}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              {error ? (
                <div className="transform motion-safe:hover:scale-110 flex text-red-700 bg-red-100 px-4 py-2 rounded">
                  <div className="text-sm md:text-normal inline">{error}</div>{" "}
                </div>
              ) : null}
              {addStudentFields.map((field) => (
                <div className="my-2" key={field.id}>
                  <label
                    htmlFor={field.name}
                    className="text-gray-500 font-normal"
                  >
                    {field.label}
                  </label>
                  <Field
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    autoComplete={
                      field.name === "password"
                        ? "current-password"
                        : field.name
                    }
                    className={`relative block w-full px-3 py-3 border ${
                      errors[field.name] && touched[field.name]
                        ? "border-red-300 placeholder-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                    } text-gray-900 rounded-lg focus:outline-none  focus:z-10 sm:text-sm shadow-sm`}
                    placeholder={field.label}
                  />
                  <ErrorMessage
                    className="text-red-500 my-2"
                    component="div"
                    name={field.name}
                  />
                </div>
              ))}

              <div className="my-2">
                <label htmlFor="course" className="text-gray-500 font-normal">
                  Course of Study
                </label>
                <Field
                  as="select"
                  className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 text-gray-900 rounded-lg focus:outline-none  focus:z-10 sm:text-sm shadow-sm"
                  name="course"
                >
                  <option value="computer_science">Computer Science</option>
                  <option value="computer_technology">
                    Computer Technology
                  </option>
                  <option value="mass_comm">Mass communication</option>
                </Field>
              </div>
              <div className="my-2">
                <label htmlFor="level" className="text-gray-500 font-normal">
                  Level
                </label>
                <Field
                  as="select"
                  className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 text-gray-900 rounded-lg focus:outline-none  focus:z-10 sm:text-sm shadow-sm"
                  name="level"
                >
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                </Field>
              </div>
              <div className="mt-2">
                <button
                  type="submit"
                  className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <svg
                      style={{ borderTopColor: "transparent" }}
                      className="animate-spin h-5 w-5 mr-3 rounded-full border-2 border-white border-solid"
                      viewBox="0 0 24 24"
                    >
                      {" "}
                    </svg>
                  ) : null}
                  {isSubmitting ? "Adding..." : "Add student"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddStudent;
