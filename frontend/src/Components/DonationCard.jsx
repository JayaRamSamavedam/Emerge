import React, { useEffect, useState } from "react";
import { Request } from "../helpers/axios_helper";

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const DonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [scheduledDonations, setScheduledDonations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("normal");

  const fetchDonations = async (currentPage, type) => {
    try {
      const response = await Request(
        "GET", 
        `/donations?page=${currentPage}&limit=5&type=${type}`
      );
      const { donations, pages } = response.data;
      setDonations(donations);
      setTotalPages(pages);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchScheduledDonations = async (currentPage) => {
    try {
      const response = await Request(
        "GET", 
        `/scheduledDonations?page=${currentPage}&limit=5`
      );
      const { donations, pages } = response.data;
      setScheduledDonations(donations);
  setPage(1);

      setTotalPages(pages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (activeTab === "normal") {
      fetchDonations(page, activeTab);
    } else {
      fetchScheduledDonations(page);
    }
  }, [page, activeTab]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="min-h-screen bg-[#F2EFE4] p-6 pt-20">
      <header className="text-center py-6">
        <h1 className="text-4xl font-bold text-black">Your Donations</h1>
        <p className="text-lg text-gray-700">View and track all your donation details here.</p>
      </header>
      
      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <ul className="flex bg-gray-100 rounded-2xl p-2">
          <li>
            <button 
              className={`py-3 px-6 font-medium rounded-xl transition-all ${activeTab === "normal" ? "bg-white text-indigo-600" : "text-gray-500 hover:text-gray-800"}`} 
              onClick={() => { setActiveTab("normal"); setPage(1); }}>
              All Donations
            </button>
          </li>
          <li>
            <button 
              className={`py-3 px-6 font-medium rounded-xl transition-all ${activeTab === "recurring" ? "bg-white text-indigo-600" : "text-gray-500 hover:text-gray-800"}`} 
              onClick={async () => { fetchScheduledDonations(); setActiveTab("recurring"); setPage(1);  }}>
              Recurring Donations Schedules
            </button>
          </li>
        </ul>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {(activeTab === "normal" ? donations : scheduledDonations).map((donation, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-black">{donation.ministry}</h2>
              <p className="text-sm text-gray-500">
                <strong>Date:</strong> {formatDate(donation.startDate || donation.createdAt)}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-lg font-bold text-green-600">
                  ${donation.amount} {donation.currency}
                </p>
              </div>
              {activeTab === "normal" ? (<div>
                <p className="text-sm text-gray-600">Recurring</p>
                <p className={`text-sm font-semibold ${donation.isRecurring ? "text-green-700" : "text-gray-500"}`}>
                  
                  {donation.isRecurring ? "Yes" : "No"}
                </p>
              </div> ):(
                <>
                <div>
                <p className="text-sm text-gray-600">Is Active</p>
                <p className={`text-sm font-semibold ${donation.isRecurring ? "text-green-700" : "text-gray-500"}`}>
                  {donation.isActive ? "Yes" : "No"}
                </p>
              </div>
             
              </>
        )}
              
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          className={`px-4 py-2 rounded-md ${page === 1 ? "bg-gray-300 text-gray-600" : "bg-black text-white"}`}
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-black font-medium">Page {page} of {totalPages}</span>
        <button
          className={`px-4 py-2 rounded-md ${page === totalPages ? "bg-gray-300 text-gray-600" : "bg-black text-white"}`}
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DonationsPage;