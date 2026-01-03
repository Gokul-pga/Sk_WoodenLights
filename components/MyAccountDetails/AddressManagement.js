"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/app/envfile/api";
import { FaCheckCircle, FaEdit, FaPlus, FaStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosArrowUp } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";


const primaryColor = "#a52a2a"; // Brown
const primaryColorDark = "#7a1717"; // Darker Brown/Maroon
const accentBgColor = "#f8f3f0"; // Light Beige/Cream background for default
const hoverBgColor = "#ffe2d4"; // Lighter hover/focus color

const AddressCard = React.memo(({ addr, onEdit, onSetDefault, onDelete }) => (
  <div
    style={{
      borderColor: addr.isDefaultDelivery ? primaryColor : "#e5e7eb",
      backgroundColor: addr.isDefaultDelivery ? accentBgColor : "#ffffff",
    }}
    className={`relative border rounded-xl p-5 shadow-lg transition-all duration-300 ${
      addr.isDefaultDelivery
        ? "ring-2 ring-offset-2 ring-amber-300"
        : "hover:shadow-xl"
    } transform hover:scale-[1.01]`}
  >
    <div className="flex items-start justify-between">
      <div className="flex flex-row gap-5">
        <div
          style={{
            color: addr.isDefaultDelivery ? primaryColorDark : "#1f2937",
          }}
          className="text-xl font-bold"
        >
          {addr.addressType || "Delivery Address"}
        </div>
        {addr.isDefaultDelivery && (
          <div
            style={{ backgroundColor: primaryColor }}
            className="flex items-center gap-1 text-xs font-bold text-white px-3 py-1 rounded-full shadow-md"
          >
            <FaStar className="text-lg text-amber-300" /> DEFAULT
          </div>
        )}
      </div>
      <div className="flex gap-3 text-gray-400">
        <button
          style={{ color: primaryColor }}
          onClick={() => onEdit(addr)}
          className="hover:text-red-500 cursor-pointer transition p-1"
          title="Edit Address"
        >
          <FaEdit className="text-xl" />
        </button>
        <button
          style={{ color: primaryColor }}
          onClick={() => onDelete(addr.recordId)}
          className="hover:text-red-500 cursor-pointer transition p-1"
          title="Delete Address"
        >
          <MdDelete className="text-xl" />
        </button>
      </div>
    </div>

    <p className="text-gray-600 text-sm leading-relaxed mt-2">
      <span className="font-semibold text-gray-800">
        {addr.firstName} {addr.lastName}
      </span>
      <br />
      {addr.line1}
      {addr.line2 && `, ${addr.line2}`},
      <br />
      {addr.city}, {addr.state} - {addr.pinCode} ({addr.country})
      <br />
      <span className="text-xs text-gray-500">
        Phone: {addr.phone} | Email: {addr.email}
      </span>
    </p>

    {!addr.isDefaultDelivery && (
      <button
        onClick={() => onSetDefault(addr.recordId)}
        style={{ color: primaryColor }}
        className="mt-4 flex cursor-pointer items-center gap-2 hover:text-opacity-80 transition text-sm font-medium border border-transparent hover:border-b"
      >
        <FaCheckCircle  className="w-4 h-4" /> Set as Default
      </button>
    )}
  </div>
));

// New Address Form Component (using React.memo)
const NewAddressForm = React.memo(
  ({
    newAddress,
    handleInputChange,
    handleSaveNewAddress,
    editingId,
    hoverBgColor,
    primaryColor,
  }) => (
    <div className="p-6 bg-white rounded-xl border border-gray-200 mt-6 shadow-xl">
      <h4
        style={{ color: primaryColorDark }}
        className="text-2xl font-bold mb-4 flex items-center gap-2"
      >
        <FaPlus  className="w-5 h-5" />{" "}
        {editingId ? "Edit Address" : "Add New Address"}
      </h4>

      <form onSubmit={handleSaveNewAddress} className="space-y-4">
        {/* First & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="firstName"
            value={newAddress.firstName}
            onChange={handleInputChange}
            required
            hoverBgColor={hoverBgColor}
          />
          <Input
            label="Last Name"
            name="lastName"
            value={newAddress.lastName}
            onChange={handleInputChange}
            required
            hoverBgColor={hoverBgColor}
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={newAddress.email}
            onChange={handleInputChange}
            required
            hoverBgColor={hoverBgColor}
          />
          <Input
            label="Phone"
            name="phone"
            type="number"
            value={newAddress.phone}
            onChange={handleInputChange}
            required
            hoverBgColor={hoverBgColor}
          />
        </div>

        {/* Address Type, Pincode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Address Type (e.g., Home, Work)"
            name="addressType"
            value={newAddress.addressType}
            onChange={handleInputChange}
            required
            hoverBgColor={hoverBgColor}
          />
          <Input
            label="Pincode"
            name="pinCode"
            type="number"
            value={newAddress.pinCode}
            onChange={handleInputChange}
            required
            hoverBgColor={hoverBgColor}
          />
        </div>

        {/* Street Address */}
        <Input
          label="Street Address 1"
          name="line1"
          value={newAddress.line1}
          onChange={handleInputChange}
          required
          hoverBgColor={hoverBgColor}
        />
        <Input
          label="Street Address 2 (Optional)"
          name="line2"
          value={newAddress.line2}
          onChange={handleInputChange}
          hoverBgColor={hoverBgColor}
        />

        {/* City, State, Country */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="City"
            name="city"
            value={newAddress.city}
            onChange={handleInputChange}
            required
            hoverBgColor={hoverBgColor}
          />
          <Input
            label="State"
            name="state"
            value={newAddress.state}
            onChange={handleInputChange}
            required
            hoverBgColor={hoverBgColor}
          />
          <Input
            label="Country"
            name="country"
            value={newAddress.country}
            onChange={handleInputChange}
            required
            hoverBgColor={hoverBgColor}
          />
        </div>

        {/* Default Delivery Checkbox */}
        <div className="flex items-center pt-2">
          <input
            type="checkbox"
            id="isDefaultDelivery"
            name="isDefaultDelivery"
            checked={newAddress.isDefaultDelivery}
            onChange={handleInputChange}
            className="h-5 w-5 border-gray-300 rounded focus:ring-4 cursor-pointer"
            style={{
              backgroundColor: newAddress.isDefaultDelivery
                ? primaryColor
                : "#ffffff",
              borderColor: primaryColor,
              color: primaryColor,
            }}
          />
          <label
            htmlFor="isDefaultDelivery"
            className="ml-3 block text-base font-medium text-gray-700 select-none"
          >
            Set as Default Delivery Address
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            style={{ backgroundColor: primaryColor }}
            className="px-8 py-3 rounded-lg font-bold flex items-center gap-2 text-white hover:bg-[#7a1717] transition-all duration-200 shadow-lg shadow-[#a52a2a]/40 transform hover:scale-[1.02]"
          >
            <FaCheckCircle className="w-5 h-5" />{" "}
            {editingId ? "Update Address" : "Save New Address"}
          </button>
        </div>
      </form>
    </div>
  )
);

// Generic Input Component
const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  hoverBgColor,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 transition duration-150 focus:border-transparent focus:outline-none"
      style={{
        "--tw-ring-color": hoverBgColor,
        borderColor: value ? primaryColor : "#d1d5db",
      }}
      required={required}
    />
  </div>
);

// Toast/Message Component
const ToastMessage = ({ message, onClose }) => {
  if (!message) return null;

  const isError =
    message.includes("Failed") ||
    message.includes("Error") ||
    message.includes("not authenticated");

  // Automatically close after 3 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl text-white font-semibold transition-opacity duration-300 ${
        isError ? "bg-red-500" : "bg-green-500"
      }`}
    >
      {message}
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  // Custom Styles
  const primaryBg = { backgroundColor: primaryColor };
  const primaryHover = { backgroundColor: primaryColorDark };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full transform transition-all duration-300 scale-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Action</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={primaryBg}
            className="px-4 py-2 text-white rounded-lg transition font-medium hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

function AddressManagement() {
  const [addresses, setAddresses] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Custom UI State Management
  const [message, setMessage] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const showMessage = (text) => {
    setMessage(text);
  };

  const resetForm = () => {
    setNewAddress({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      addressType: "",
      addressType: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      country: "India",
      isDefaultDelivery: false,
    });
    setEditingId(null);
  };

  useEffect(() => {
    fetchUserProfile();
    // Clean up toast message on component unmount
    return () => setMessage(null);
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
        const user = res.data.data;

        setAddresses(user.addresses || []);
      } else {
        toast.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);

      toast.error("Error fetching profile");
    }
  };

  const handleEditAddress = (addr) => {
    setNewAddress({ ...addr }); // populate form with existing address
    setEditingId(addr.recordId); // mark as editing
    setShowForm(true); // open form
  };

  // State for the new address form inputs
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    addressType: "",
    pinCode: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "India",
    isDefaultDelivery: false,
  });

  // --- Handlers ---

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();

    // Simple validation
    if (
      !newAddress.firstName ||
      !newAddress.addressType ||
      !newAddress.pinCode ||
      !newAddress.line1 ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.phone
    ) {
      showMessage("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      showMessage("User not authenticated! Cannot save address to backend.");
      // Local-only save for UI continuity
      // const newRecordId = editingId || Date.now().toString();
      // const updatedAddress = { ...newAddress, recordId: newRecordId };

      // setAddresses((prev) => {
      //   if (editingId) {
      //     return prev.map((addr) =>
      //       addr.recordId === editingId ? updatedAddress : addr
      //     );
      //   } else {
      //     return prev ? [...prev, updatedAddress] : [updatedAddress];
      //   }
      // });

      // resetForm();
      // setShowForm(false);
      return;
    }

    try {
      let updatedAddress;

      if (editingId) {
        // 🔁 UPDATE EXISTING ADDRESS
        const res = await axios.post(
          `${api}/admin/user/address/update`,
          {
            recordId: editingId, // include recordId since backend expects it in body
            firstName: newAddress.firstName,
            lastName: newAddress.lastName,
            phone: newAddress.phone,
            email: newAddress.email,
            addressType: newAddress.addressType,
            pinCode: newAddress.pinCode,
            line1: newAddress.line1,
            line2: newAddress.line2,
            city: newAddress.city,
            state: newAddress.state,
            country: newAddress.country,
            isDefaultDelivery: newAddress.isDefaultDelivery,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        updatedAddress = res.data.data || newAddress;
        fetchUserProfile();
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.recordId === editingId ? updatedAddress : addr
          )
        );

        showMessage("Address updated successfully!");
      } else {
        // ➕ ADD NEW ADDRESS
        const res = await axios.post(
          `${api}/admin/user/address/add`,
          {
            firstName: newAddress.firstName,
            lastName: newAddress.lastName,
            phone: newAddress.phone,
            email: newAddress.email,
            addressType: newAddress.addressType,
            pinCode: newAddress.pinCode,
            line1: newAddress.line1,
            line2: newAddress.line2,
            city: newAddress.city,
            state: newAddress.state,
            country: newAddress.country,
            isDefaultDelivery: newAddress.isDefaultDelivery,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        updatedAddress = res.data.data || newAddress;
        fetchUserProfile();
        setAddresses((prev) =>
          prev ? [...prev, updatedAddress] : [updatedAddress]
        );

        showMessage("New address added successfully!");
      }

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving address:", error);
      showMessage("Failed to save address. Please check your connection.");
    }
  };

  const handleSetDefault = async (recordId) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${api}/admin/user/address/update`,
        {
          recordId,
          isDefaultDelivery: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUserProfile();
      showMessage("Default address updated.");
    } catch (error) {
      console.error("Error setting default address:", error);
      showMessage("Failed to set default address. Please try again.");
    }
  };
  const handleDeleteAddress = async (recordId) => {
    // Optional: confirm before deleting
    // const confirmDelete = window.confirm("Are you sure you want to delete this address?");
    // if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        showMessage("User not authenticated!");
        return;
      }

      const res = await axios.post(
        `${api}/admin/user/address/delete`,
        { recordId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        showMessage("Address deleted successfully!");
        fetchUserProfile(); // refresh after delete
      } else {
        showMessage(res.data.message || "Failed to delete address.");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      showMessage("Something went wrong. Please try again.");
    }
  };

  // // 1. Initiate delete confirmation
  // const handleDeleteAddress = (id) => {
  //   setDeleteId(id);

  // };

  // 2. Perform deletion after user confirms
  const confirmDelete = async () => {
    if (deleteId) {
      const token = localStorage.getItem("authToken");

      if (token) {
        // Simulate API call to delete
        // await axios.delete(`${api}/admin/user/address/${deleteId}`, { headers: { Authorization: `Bearer ${token}` } });
      }

      setAddresses(addresses.filter((addr) => addr.recordId !== deleteId));
      showMessage("Address deleted successfully.");
    }
    setDeleteId(null);
    setIsConfirmOpen(false);
  };

  // 3. Cancel deletion
  const cancelDelete = () => {
    setDeleteId(null);
    setIsConfirmOpen(false);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-inter">
      {/* Custom Message/Toast */}
      <ToastMessage message={message} onClose={() => setMessage(null)} />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        message="Are you sure you want to permanently delete this address? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <div className="max-w-6xl mx-auto">
        <h2
          style={{ color: primaryColorDark }}
          className="text-2xl md:text-3xl font-extrabold mb-8 flex items-center gap-3 border-b pb-4"
        >
          <FaLocationDot
            style={{ color: primaryColor }}
            className="text-2xl w-7 h-7"
          />
          Manage Delivery Addresses
        </h2>

        {/* Toggle Button for Add New Address Form */}
        <button
          onClick={() => {
            setShowForm(!showForm);
            // Reset form when opening/closing if not currently editing
            if (!showForm || editingId) {
              resetForm();
            }
          }}
          style={{
            borderColor: primaryColor,
            backgroundColor: showForm ? hoverBgColor : accentBgColor,
            color: showForm ? primaryColorDark : primaryColor,
          }}
          className={`w-full flex justify-center items-center gap-2 p-3 rounded-xl font-bold transition-all duration-300 mb-8 border-2 ${
            showForm ? "border-solid" : "border-dashed"
          } shadow-md hover:shadow-lg`}
        >
          {showForm ? (
            <>
              <IoIosArrowUp  className="text-2xl" /> Close Address Form
            </>
          ) : (
            <>
              <FaPlus  className="w-5 h-5" /> Add New Address
            </>
          )}
        </button>

        {/* Conditional Rendering of New Address Form */}
        {showForm && (
          <NewAddressForm
            newAddress={newAddress}
            handleInputChange={handleInputChange}
            handleSaveNewAddress={handleSaveNewAddress}
            editingId={editingId}
            hoverBgColor={hoverBgColor}
            primaryColor={primaryColor}
          />
        )}

        <h3 className="text-2xl font-semibold text-gray-800 mt-10 mb-5">
          {addresses
            ? `${addresses.length} Saved Addresses`
            : "Loading Addresses..."}
        </h3>

        {/* Saved Addresses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses?.map((addr) => (
            <AddressCard
              key={addr.recordId}
              addr={addr}
              onEdit={handleEditAddress}
              onSetDefault={handleSetDefault}
              onDelete={handleDeleteAddress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddressManagement;
