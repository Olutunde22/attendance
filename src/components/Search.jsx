import React, { useState } from "react";
import Axios from "axios";
import { Link } from 'react-router-dom'

const Search = () => {
    const [search, setSearch] = useState("")
    const [studentList, setStudentList] = useState()

    const handleSearchChange = async (value) => {
        setSearch(value)
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
            setStudentList(data)

        } catch (err) {

        }
    }

    return (
        <div className=" w-full md:w-1/4 lg:w-1/6 relative mb-10">
            <input type="text" className="form-control  block px-3 py-1.5 text-base font-normal text-gray-700 value={search} onChange={(e)=> handleSearchChange(e.target.value)}  bg-white bg-clip-padding  border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="search" placeholder="Search Students" />
            {studentList && <div className="absolute w-full flex">
                <ul className="bg-white rounded-lg border border-gray-200 w-96 text-gray-900">
                    {studentList.map((student) => <Link to={`/student/${student._id}`} key={student._id} className="px-6 py-2 border-b border-gray-200 w-full rounded-t-lg">{student.firstName}</Link>)}
                </ul>
            </div>}

        </div>
    );
};

export default Search;
