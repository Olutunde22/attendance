import React, { Fragment, useState, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import Modal from "./Modal";
import { ExclamationIcon } from "@heroicons/react/outline";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import QRModal from "./QRModal";
import ViewClass from "./ViewClass";
import ViewParticipants from "./ViewParticipants";

const navigation = [{ name: "Classes", href: "#", current: true }];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Lecturer = () => {
  const [modal, setModal] = useState(false);
  const [qrModal, setQrModal] = useState(false);
  let history = useHistory();
  const [classes, setClasses] = useState([]);
  const [participants, setParticipants] = useState({});
  const [error, setError] = useState("");
  const [classId, setClassId] = useState("");
  const [className, setClassName] = useState("")
  const [viewPage, setViewPage] = useState("viewclass");
  let userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const getClasses = async () => {
    let userId = userInfo.id;
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await Axios.get(
        "https://3000-copper-damselfly-vwfk70rf.ws-eu25.gitpod.io/api/getclasses/" +
          userId,
        config
      );
      setClasses(data);
    } catch (err) {
      setError(
        "Error Occured while trying to get classes, please refresh page or contact administrator"
      );
    }
  };

  const getParticipants = async (classId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await Axios.get(
        "https://3000-copper-damselfly-vwfk70rf.ws-eu25.gitpod.io/api/getclassparticipants/" +
          classId,
        config
      );
      setParticipants(data.participants);
      setViewPage("viewparticipants");
    } catch (err) {
      setError("Error Occured while trying to get class Participants");
    }
  };

  const onModalClose = () => {
    setModal(false);
    setQrModal(false);
  };

  useEffect(() => {
    if (userInfo) {
      getClasses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewPage]);

  if (!userInfo) {
    history.push("/login");
  }

  return (
    <>
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
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "px-3 py-2 rounded-md text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Profile dropdown */}
                      <Menu as="div" className="ml-3 relative">
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
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setModal(true)}
            >
              {" "}
              Create New Class
            </button>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              {error ? (
                <div className="transform motion-safe:hover:scale-110 flex text-red-700 bg-red-100 py-2 px-4 m-4 rounded">
                  <div className="text-sm md:text-normal inline items-center justify-center">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    {error}
                  </div>{" "}
                </div>
              ) : null}
            </div>
            {viewPage === "viewclass" && classes.length > 0 ? (
              <ViewClass
                classes={classes}
                setQrModal={setQrModal}
                setClassId={setClassId}
                setClassName={setClassName}
                setViewPage={setViewPage}
                getParticipants={getParticipants}
              />
            ) : null}
            {viewPage === "viewparticipants" ? (
              <ViewParticipants
                setViewPage={setViewPage}
                className={className}
                participants={participants}
              />
            ) : null}
          </div>
        </main>
        <QRModal
          modal={qrModal}
          onModalClose={onModalClose}
          getClasses={getClasses}
          classId={classId}
        />
        <Modal
          modal={modal}
          onModalClose={onModalClose}
          getClasses={getClasses}
        />
      </div>
    </>
  );
};

export default Lecturer;
