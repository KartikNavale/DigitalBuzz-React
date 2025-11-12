 import React from "react";

const Card = ({ title, children }) => {
  return (
    <div className="w-[90%] md:w-3/4 h-[80vh] mx-auto bg-white shadow-lg rounded-xl p-6 md:p-10 mt-6">
      {/* Title (top-left) */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 text-left">
        {title}
      </h2>

      {/* Content area */}
      <div className="overflow-auto h-[calc(80vh-5rem)]">
        {children}
      </div>
    </div>
  );
};

export default Card;
