import React, { Fragment, useState, useEffect, useCallback } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const navigation = [{ name: "Classes", href: "#", current: true }];
const userNavigation = [{ name: "Your Profile", href: "#" }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Lecturer = () => {
  let navigate = useNavigate();
  const { studentId } = useParams();
  const [studentDetails, setStudentDetails] = useState();
  let userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (userInfo === null) {
      navigate("/login");
    }
  }, [userInfo]);

  const handleGetStudent = useCallback(async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await Axios.get(
        `https://attendancebe.herokuapp.com/api/student/${studentId}/lecturer/${userInfo.id}`,
        config
      );
      console.log(data);
      setStudentDetails(data);
    } catch (err) {}
  }, []);

  useEffect(() => {
    handleGetStudent();
  }, [handleGetStudent]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const getNumberOfClass = (a) => {
    const index = studentDetails.classTotal.findIndex(
      (c) => c._id.toLowerCase() === a.toLowerCase()
    );
    return studentDetails.classTotal[index].num;
  };

  const calculateGrade = ({ _id, num }) => {
    const index = studentDetails.classTotal.findIndex(
      (c) => c._id.toLowerCase() === _id.toLowerCase()
    );
    let totalNum = studentDetails.classTotal[index].num;
    return `${Math.round((num / totalNum) * 100)}%`;
  };

  return (
    <>
      {studentDetails && (
        <div className="min-h-full">
          <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
              <>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-8 w-8"
                          src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                          alt="Workflow"
                        />
                      </div>
                      <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                          <a
                            href="/lecturer"
                            className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                          >
                            Classes
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-4 flex items-center md:ml-6">
                        {/* Profile dropdown */}
                        <Menu as="div" className="ml-3 relative">
                          <div>
                            <button
                              onClick={handleLogout}
                              className=" bg-red-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                              Logout
                            </button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <a
                                      href={item.href}
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      {item.name}
                                    </a>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <MenuIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="md:hidden">
                  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "block px-3 py-2 rounded-md text-base font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                  <div className="pt-4 pb-3 border-t border-gray-700">
                    <div className="items-center px-5">
                      <div className="text-base font-medium leading-none text-white mb-2">
                        Hello, {userInfo.firstName}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-400">
                        {userInfo.email}
                      </div>
                    </div>
                    <div className="mt-3 px-2 space-y-1">
                      {userNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}
                      <button
                        onClick={handleLogout}
                        className=" bg-red-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 font-bold flex justify-between">
              <h1 className="text-3xl font-bold text-gray-900">
                {studentDetails.student.firstName}{" "}
                {studentDetails.student.lastName}
              </h1>
              {studentDetails.student.matricNumber}
            </div>
          </header>
          <main className=" w-full mx-2 md:w-10/12 md:mx-auto mt-4">
            <h1 className=" text-xl md:text-3xl font-bold mx-2 mt-4 mb-6 text-gray-800">
              List of Classes you had - {studentDetails.classTotal.length}
            </h1>
            <div className="flex">
              <ul className="bg-white rounded-lg border border-gray-200 w-11/12 text-gray-900">
                {studentDetails.classTotal.map((c) => (
                  <li className="px-6 py-2 border-b border-gray-200 w-full rounded-t-lg">
                    {c._id}
                  </li>
                ))}
              </ul>
            </div>
            <h1 className="text-xl md:text-3xl font-bold mx-2 mt-4 mb-6 text-gray-800">
              List of Classes {studentDetails.student.firstName} attended -{" "}
              {studentDetails.studentAttendance.length}
            </h1>

            {studentDetails.studentAttendance &&
            studentDetails.studentAttendance.length > 0 ? (
              studentDetails.studentAttendance.map((st) => (
                <div
                  key={st._id}
                  className="shadow-md flex bg-white justify-between mt-8 px-4 py-4"
                >
                  <div>
                    <h1 className="text-lg md:text-2xl font-bold text-blue-500 mb-5 px-2">
                      {st._id}
                    </h1>
                    <p className="text-sm md:text-base font-bold text-center leading-relaxed mt-2 mb-2 px-2 text-gray-800">
                      Number of times attended: {st.num}
                    </p>
                    <p className="text-sm md:text-base font-bold text-center leading-relaxed mt-2 mb-2 px-2 text-gray-800">
                      Number of times class held: {getNumberOfClass(st._id)}
                    </p>
                  </div>
                  <div>
                    <h1 className="text-xl md:text-4xl font-bold">{calculateGrade(st)}</h1>
                  </div>
                </div>
              ))
            ) : (
              <h1>
                {studentDetails.student.firstName} did not attend any class
              </h1>
            )}
          </main>
        </div>
      )}
    </>
  );
};

export default Lecturer;
