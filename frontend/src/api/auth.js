import axios from "./axios";

export async function Login(data) {
  return await axios.post(`/user/login/`, data);
}
export async function Register(data) {
  return await axios.post(`/user/register/`, data);
}

export async function GetProfile() {
  return await axios.get(`/user/profile/`);
}

export async function ChangePassword(data) {
  return await axios.post(`/user/change-password/`, data);
}

export async function ForgetPassword(email) {
  return await axios.post(`/user/forget-password/`, email);
}

export async function SetPasswordFirst(data) {
  return await axios.post(`/user/reset-password/`, data);
}
