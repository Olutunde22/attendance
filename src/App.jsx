import React, { Suspense } from 'react';
import { Login, Signup, Lecturer, AddStudent, ForgotPassword, ResetPassword } from './routes';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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
					<Route path="/" exact component={Login} />
					<Route path="/login" exact component={Login} />
					<Route path="/signup" exact component={Signup} />
					<Route path="/forgot" exact component={ForgotPassword} />
					<Route path="/reset/:resetId" component={ResetPassword} />
					<Route path="/addstudent" exact component={AddStudent} />
					<Route path="/lecturer" exact component={Lecturer} />
				</Routes>
			</Suspense>
		</Router>
	);
}

export default App;
