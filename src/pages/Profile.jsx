import React from "react";
import { useAuth } from "../context/AuthContext";
import UserProfile from "../components/UserProfile";
import AdminProfile from "../components/AdminProfile";

const Profile = () => {
  const { role } = useAuth();
  
  return (
    <>
      {role === "admin" ? <AdminProfile /> : <UserProfile />}
    </>
  );
};

export default Profile;