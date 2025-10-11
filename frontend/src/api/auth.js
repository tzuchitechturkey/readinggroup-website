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
  // data: { current_password, new_password }
  return await axios.post(`/user/change-password/`, data);
}
