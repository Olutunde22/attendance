import React, { Suspense } from 'react';
import { Login, Signup, Lecturer, Student, AddStudent, ForgotPassword, ResetPassword } from './routes';
import { BrowserRouter as Router, Route, Routes,  } from 'react-router-dom';

function App() {
	return (
		<Router>
			<Suspense
				fallback={
					<div className="flex items-center flex-col min-h-screen justify-center">
						{' '}
						<svg
							style={{ borderTopColor: 'transparent' }}
							className="animate-spin h-20 w-20 rounded-full border-blue-500 border-4 border-solid"
							viewBox="0 0 24 24"
						></svg>
						<span className="text-gray-500 text-2xl mt-4">Loading...</span>
					</div>
				}
			>
				<Routes>
					<Route path="/" exact element={<Login />} />
					<Route path="/login" exact element={<Login />} />
					<Route path="/signup" exact element={<Signup />} />
					<Route path="/forgot" exact element={<ForgotPassword />} />
					<Route path="/reset/:resetId" element={<ResetPassword />} />
					<Route path="/addstudent" exact element={<AddStudent />} />
					<Route path="/lecturer" exact element={<Lecturer />} />
					<Route path="/student/:studentId" element={<Student />} />
				</Routes>
			</Suspense>
		</Router>
	);
}

export default App;