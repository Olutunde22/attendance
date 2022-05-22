import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signupFields } from "./formFields";
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";


const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required("Firstname is required"),
  lastName: Yup.string().required("Lastname is required"),
  email: Yup.string().email("Invalid Email").required("Email is Required"),
  department: Yup.string().required("Department is required"),
  password: Yup.string()
    .min(6, "Password is too short")
    .required("Password is Required"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

const Signup = () => {
  const [error, setError] = useState("");
  let navigate = useNavigate();
  const handleSignup = async (
    { firstName, lastName, email, password, department },
    { setSubmitting }
  ) => {
    setSubmitting(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await Axios.post(
        "https://attendancebe.herokuapp.com/api/signup",
        { email, password, firstName, lastName, department },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/lecturer");
    } catch (err) {
      setError(err.response.data.message);
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };



  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    navigate("/lecturer");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 xl:px-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 px-12 bg-white py-8 shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-xl sm:text-3xl font-extrabold text-gray-900">
            Sign up
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Login here
            </Link>
          </p>
        </div>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            department: "Computer Science",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              {error ? (
                <div className="transform motion-safe:hover:scale-110 flex text-red-700 bg-red-100">
                  <div className="text-sm md:text-normal inline">{error}</div>{" "}
                </div>
              ) : null}
              {signupFields.map((field, idx) => (
                <div className="my-2" key={field.id}>
                  {idx === 3 && (
										<div className="my-2">
											<label htmlFor="course" className="text-gray-500 font-normal">
												Department
											</label>
											<Field
												as="select"
												className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 text-gray-900 rounded-lg focus:outline-none  focus:z-10 sm:text-sm shadow-sm"
												name="department"
											>
												<option value="Computer Science">Computer Science</option>
												<option value="Computer Technology">Computer Technology</option>
												<option value="Mass Communication">Mass communication</option>
											</Field>
										</div>
									)}
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
                  {isSubmitting ? "Signing up..." : "Sign up"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;