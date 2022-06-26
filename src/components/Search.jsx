import React, { useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

const Search = () => {
  const [search, setSearch] = useState("");
  const [studentList, setStudentList] = useState();
  const [loading, setLoading] = useState(false);

  const handleSearchChange = async (value) => {
    setSearch(value);
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await Axios.get(
        `https://attendancebe.herokuapp.com/api/students?matricNum=${value}`,
        config
      );
      setStudentList(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" w-full md:w-1/4 lg:w-1/6 relative mb-10">
      <input
        type="text"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="form-control  block px-3 py-1.5 text-base font-normal text-gray-700   bg-white bg-clip-padding  border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        id="search"
        placeholder="Search Students"
      />
      {studentList && (
        <div className="absolute w-full flex">
          <ul className="bg-white rounded-lg border border-gray-200 w-96 text-gray-900">
            {loading && (
              <div className="flex items-center justify-center py-4 px-2">
                {" "}
                <svg
                  style={{ borderTopColor: "transparent" }}
                  className="animate-spin h-6 w-6 rounded-full border-blue-500 border-2 border-solid"
                  viewBox="0 0 24 24"
                ></svg>
              </div>
            )}
            {!loading &&
              studentList.map((student) => (
                <li
                  key={student._id}
                  className="px-6 py-4 border-b border-gray-200 w-full rounded-t-lg"
                >
                  <Link to={`/student/${student._id}`}>
                    {" "}
                    {student.firstName} - {student.matricNumber}
                  </Link>
                </li>
              ))}

            {!loading && studentList && studentList.length === 0 ? (
              <p className="text-base font-bold text-center leading-relaxed mt-2 mb-4 px-2 text-blue-800">
                No student with this matric number
              </p>
            ) : null}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
