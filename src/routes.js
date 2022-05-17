import { lazy } from 'react';

export const Login = lazy(() => import('./components/auth/Login'))

export const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword'))

export const ResetPassword = lazy(() => import('./components/auth/ResetPassword'))

export const AddStudent = lazy(() => import('./components/auth/AddStudent'));

export const Signup = lazy(() => import('./components/auth/Signup'))

export const Lecturer = lazy(() => import('./components/Lecturer'))


