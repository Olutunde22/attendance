import { Fragment, useRef, useState, useEffect, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import QrReader from "react-qr-reader";
import Axios from "axios";

const QRModal = ({ modal, onModalClose, getClasses, classId }) => {
  const [open, setOpen] = useState(modal);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [warning, setWarning] = useState("")
  const [webcamOpen, setWebCamOpen] = useState(false)
  const [qrScannerOpen, setQrScannerOpen] = useState(true)
  const [scan, setScan] = useState(true)
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    setOpen(modal);
  }, [modal]);

  const handleScan = useCallback(async (result) => {
    if (result && scan) {
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
          setSuccess('Added student');
          setTimeout(() => {
            setSuccess("");
          }, 3000);
          setScan(false)
          getClasses(true);
        }
      } catch (err) {
        console.log(err.response.data.message)
        if (err.response.status === 400) {
          setWarning(err.response.data.message);
          setTimeout(() => {
            setWarning("");
          }, 3000);
        }else{
          setError(err.response.data.message);
          setTimeout(() => {
            setError("");
          }, 3000);
        }

      }
    }
  }, [classId, getClasses, scan]);

  const handleError = () => {
    setError("Error Couldn't scan Qr Code");
    setTimeout(() => {
      setError("");
    }, 2000);
  };

  useEffect(() => {
    let qrcode = "";
    let interval
    if (qrScannerOpen) {
      window.addEventListener('keydown', (e) => {
        if (interval) {
          clearInterval(interval)
        }
        if (e.code === 'Enter') {
          if (qrcode) {
            handleScan(qrcode)
          }
          qrcode = ''
          return
        }
        if (e.key !== 'shift') {
          qrcode += e.key
          interval = setInterval(() => qrcode + '', 20)
        }
      })
    }
  }, [handleScan, qrScannerOpen])

  useEffect(() => {
    if (!scan) {
      setTimeout(() => {
        setScan(true)
      }, 3000);
    }
  }, [scan]);

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
                  <div className="transform motion-safe:hover:scale-110 flex text-green-700 bg-green-100 py-2 px-4 m-4 rounded">
                    <div className="text-sm md:text-normal inline">
                      {success}
                    </div>{" "}
                  </div>
                ) : null}

                {warning ? (
                  <div className="transform motion-safe:hover:scale-110 flex text-red-700 bg-yellow-100 py-2 px-4 m-4 rounded">
                    <div className="text-sm md:text-normal inline">
                      {success}
                    </div>{" "}
                  </div>
                ) : null}
                <div className="mt-3 text-center sm:mt-0 mt-2 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Scan QR Code
                  </Dialog.Title>
                  <div className="flex mt-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4" onClick={() => {
                      if (!webcamOpen) {
                        setWebCamOpen(true)
                      }

                      if (qrScannerOpen) {
                        setQrScannerOpen(false)
                      }

                    }}>Webcam</button>
                    <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                      if (webcamOpen) {
                        setWebCamOpen(false)
                      }

                      if (!qrScannerOpen) {
                        setQrScannerOpen(true)
                      }
                    }}>Scanner</button>
                  </div>

                  {webcamOpen && <div className="mt-4 h-96 w-11/12">
                    <QrReader
                      delay={300}
                      onError={handleError}
                      onScan={handleScan}
                      style={{ width: "100%" }}
                    />
                  </div>}

                  {qrScannerOpen && <div className="mt-4 w-11/12">
                    Press scanner button to scan qr
                  </div>}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 mt-4 sm:px-6 sm:flex sm:flex-row-reverse">
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

export default QRModal;
