import axios from "./axios";

export async function Login(data) {
  return await axios.post(`/user/login/`, data);
}

export async function Register(data) {
  return await axios.post(`/user/register/`, data);
}
