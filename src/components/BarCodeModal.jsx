import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import BarcodeReader from "react-barcode-reader";
import Axios from "axios";

const BarCodeModal = ({ modal, onModalClose, getClasses, classId }) => {
  const [open, setOpen] = useState(modal);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    setOpen(modal);
  }, [modal]);

  const handleScan = async (result) => {
    if (result) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await Axios.post(
          "https://attendancebe.herokuapp.com/api/addtoclass",
          { studentId: result, classId },
          config
        );
        if (data.message === "Success") {
          onModalClose(false);
          getClasses();
        } else if (data.message === "Student already in class") {
          setSuccess(data.message);
          setTimeout(() => {
            setSuccess("");
          }, 2000);
        }
      } catch (err) {
        setError(err.response.data.message);
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    }
  };

  const handleError = () => {
    setError("Error Couldn't scan Bar Code");
    setTimeout(() => {
      setError("");
    }, 2000);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={onModalClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {error ? (
                  <div className="transform motion-safe:hover:scale-110 flex text-red-700 bg-red-100 py-2 px-4 m-4 rounded">
                    <div className="text-sm md:text-normal inline">{error}</div>{" "}
                  </div>
                ) : null}

                {success ? (
                  <div className="transform motion-safe:hover:scale-110 flex text-red-700 bg-yellow-100 py-2 px-4 m-4 rounded">
                    <div className="text-sm md:text-normal inline">
                      {success}
                    </div>{" "}
                  </div>
                ) : null}
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Scan Barcode Code
                  </Dialog.Title>
                  <div className="mt-4 h-96">
                    <BarcodeReader onScan={handleScan} onError={handleError} />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => onModalClose(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default BarCodeModal;
