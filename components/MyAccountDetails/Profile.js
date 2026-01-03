"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle, FaEdit, FaMapMarkerAlt, FaSave } from "react-icons/fa";
import { api } from "@/app/envfile/api";
import toast, { Toaster } from "react-hot-toast";

function MyProfile() {


  // ✅ Initialize state
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "Not Mentioned",
    email: "Not Mentioned",
    phone: "Not Mentioned",
    dob: "Not Mentioned",
    addresses: [],
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token){
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You are not logged in!");
        return;
      }

      const res = await axios.get(`${api}/admin/user/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const user = res.data.data; // full user object
        console.log("Full User Document:", user);

        // Update the state to populate the form
        setUserData({
          name: user.name || "Not Mentioned",
          email: user.email || "Not Mentioned",
          phone: user.phone || "Not Mentioned",
          dob: user.dob || "Not Mentioned",
          addresses: user.addresses || [],
        });
      } else {
        toast.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error fetching profile");
    }
  };

  // 🔹 Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddressChange = (recordId, field, value) => {
    setUserData((prev) => ({
      ...prev,
      addresses: prev.addresses.map((addr) =>
        addr.recordId === recordId ? { ...addr, [field]: value } : addr
      ),
    }));
  };

  // 🔹 Save Profile API
  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${api}/admin/user/update`,
        {
          recordId: user.recordId,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          dob: userData.dob,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        fetchUserProfile();
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        localStorage.setItem("user", JSON.stringify({ ...user, ...userData }));
      } else {
        toast.error("❌ Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Address Card (same design)
  const AddressBlock = ({ addr, isEditing = false, onChange }) => {
    return (
      <div className="relative border border-gray-200 rounded-xl p-5 bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-[#a52a2a] font-semibold text-lg">
            <FaMapMarkerAlt className="text-xl" />
            {isEditing ? (
              <input
                type="text"
                value={addr.addressType}
                onChange={(e) =>
                  onChange(addr.recordId, "addressType", e.target.value)
                }
                className="font-semibold text-gray-800 text-lg border-b border-gray-300 outline-none bg-white"
              />
            ) : (
              addr.addressType
            )}
          </div>
        </div>
        <div className="text-gray-700 font-light leading-relaxed space-y-1">
          {["line1", "line2", "city", "state", "pincode", "country"].map(
            (field) => {
              const val = field === "pincode" ? addr[field] : addr[field] || "";
              return val ? (
                <p key={field}>
                  {isEditing ? (
                    <input
                      type="text"
                      value={val}
                      onChange={(e) =>
                        onChange(addr.recordId, field, e.target.value)
                      }
                      className="font-light text-gray-700 text-sm border-b border-gray-300 outline-none bg-white w-full"
                    />
                  ) : (
                    val
                  )}
                </p>
              ) : null;
            }
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen  flex justify-center">
      <Toaster />
      <div className="w-full bg-white p-2 space-y-8">
        {/* 🌟 Profile Header - SAME UI */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b-2 border-dashed border-gray-200">
  {/* Avatar */}
  <div className="p-2 bg-white rounded-full shadow-lg">
    <FaUserCircle className="text-7xl sm:text-8xl text-[#a52a2a] opacity-90" />
  </div>

  {/* Info + Button */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4 sm:gap-6">
    {/* User Details */}
    <div className="flex flex-col text-center sm:text-left w-full">
      {isEditing ? (
        <>
          <input
            type="text"
            name="name"
            value={userData.name}
            className="outline-none text-2xl sm:text-3xl font-bold text-[#a52a2a] bg-transparent text-center sm:text-left"
          />
          <input
            type="email"
            name="email"
            value={userData.email}
            className="outline-none text-gray-600 font-medium bg-transparent text-center sm:text-left"
          />
        </>
      ) : (
        <>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#a52a2a] tracking-tight">
            {userData.name}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            {userData.email}
          </p>
        </>
      )}
    </div>

    {/* Buttons */}
    <div className="w-full sm:w-auto flex justify-center sm:justify-end">
      {isEditing ? (
        <button
          onClick={handleSave}
          disabled={loading}
          className={`mt-2 sm:mt-0 px-6 py-2 rounded-full font-semibold flex items-center gap-2 
            text-white transition-all duration-300 min-w-[180px] sm:min-w-[200px]
            ${loading
              ? "bg-green-400 cursor-not-allowed shadow-inner"
              : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 shadow-md hover:shadow-lg"
            }`}
        >
          <FaSave className="w-4 h-4 text-white" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="mt-2 sm:mt-0 px-6 py-2 rounded-full font-semibold flex items-center gap-2 
            text-white bg-gradient-to-r from-[#a52a2a] to-[#8b1e1e] hover:from-[#8b1e1e] hover:to-[#6e1515] 
            min-w-[160px] sm:min-w-[200px] shadow-md hover:shadow-lg transition-all duration-300"
        >
          <FaEdit className="w-4 h-4 text-white" />
          Edit Profile
        </button>
      )}
    </div>
  </div>
</div>



        {/* 🌟 Personal Info Section (Same Design, Dynamically Editable) */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-[#7a1717] mb-5 border-b pb-2">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["Full Name", "Email", "Mobile", "Date of Birth"].map(
              (label, idx) => {
                const keys = ["name", "email", "phone", "dob"];
                const key = keys[idx];

                return (
                  <div
                    key={label}
                    className="flex flex-col border-l-4 border-indigo-200 pl-4 py-1 relative"
                  >
                    <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                      {label}
                    </span>

                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            name={key}
                            value={userData[key]}
                            onChange={handleChange}
                            className="font-semibold text-gray-800 text-lg border-b border-gray-300 outline-none bg-white flex-grow"
                          />
                          {/* Edit Icon to indicate field is editable */}
                          <FaEdit className="text-gray-400 w-4 h-4 cursor-pointer" />
                        </>
                      ) : (
                        <span className="font-semibold text-gray-800 text-lg">
                          {userData[key]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* 🌟 Addresses - Same UI */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-[#7a1717] mb-5 border-b pb-2">
            Saved Addresses <span className="text-sm">(Only editable in saved address)</span>
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {userData.addresses.length === 0 ? (
              <p className="text-gray-500">No addresses saved yet.</p>
            ) : (
              userData.addresses.map((addr) => (
                <AddressBlock key={addr.recordId} addr={addr} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
