"use client";

import { useRouter } from "next/navigation";

export default function NotLoggedInModal({ show, onClose, content, redirectPath = "/" }) {
  const router = useRouter();

  const handleLoginRedirect = () => {
    onClose?.();
    // localStorage.setItem("redirectAfterLogin", redirectPath);
    router.push("/login");
  };

  if (!show) return null;

  return (
    <div style={{zIndex:9999}} className="fixed inset-0 backdrop-blur-md flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md animate-fadeIn">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Login Required</h2>
        <p className="text-gray-600 mb-5 text-sm">{content || "You must log in to continue."}</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 cursor-pointer text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleLoginRedirect}
            className="px-4 py-2 bg-[#a52a2a] hover:bg-red-700 cursor-pointer text-white rounded-lg  transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
