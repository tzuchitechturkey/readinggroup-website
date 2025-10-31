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

export async function GetUserProfile(userId) {
  return await axios.get(`/user/profile/${userId}/`);
}

export async function UpdateProfile(data) {
  return await axios.put(`/user/profile/`, data);
}
export async function UpdatePatchProfile(data) {
  return await axios.patch(`/user/profile/`, data);
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

// Send friend Request
export async function SendFriendRequest(data) {
  return await axios.post(`/user/friend-requests/`, data); //"to_user": 0,
}

// Send UnFollow Request
export async function SendUnFollowRequest(userId) {
  return await axios.post(`accounts/friend-requests/unfriend/${userId}/`); //"to_user": 0,
}

// Get Friend Requests
export async function GetFriendRequests(userId) {
  return await axios.get(`user/friend-requests/user/${userId}/`);
}

// Change Request Status
export async function ChangeFriendRequestStatus(requestId, action) {
  return await axios.post(`/accounts/friend-requests/${requestId}/action/`, {
    action,
  });
}
// /accounts/friend-requests/{id}/action/
