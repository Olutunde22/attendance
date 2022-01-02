import { lazy } from 'react';

export const Login = lazy(() => import('./components/auth/Login'))

export const AddStudent = lazy(() => import('./components/auth/AddStudent'));

export const Signup = lazy(() => import('./components/auth/Signup'))

export const Home = lazy(() => import('./components/Home'))

export const Lecturer = lazy(() => import('./components/Lecturer'))


