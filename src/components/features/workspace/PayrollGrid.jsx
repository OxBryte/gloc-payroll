import { Search, Calendar, Users, DollarSign, ExternalLink } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatNumberWithCommas } from "../../lib/utils";
import moment from "moment";

export default function PayrollGrid({ payrolls }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { slug } = useParams();

  const filteredPayroll = payrolls.filter((payroll) => {
    const matchesSearch =
      payroll.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.chain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.currency?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search payroll..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredPayroll.length === 0 ? (
        <div className="text-center flex flex-col items-center w-full justify-center gap-1 py-12 bg-white rounded-lg">
          <img src="/empty.svg" alt="" className="w-20" />
          <div className="text-gray-500 text-lg">No payrolls found</div>
          <div className="text-gray-400">
            Try adjusting your search or filter criteria
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPayroll.map((payroll, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 capitalize">
                        {payroll?.title}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize mt-1">
                        {payroll?.category}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        payroll?.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : payroll?.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payroll?.status}
                    </div>
                  </div>

                  {/* Chain and Currency */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded capitalize">
                      {payroll?.chain}
                    </span>
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded capitalize">
                      {payroll?.currency}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Financial Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Gross Amount</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-800">
                        ${formatNumberWithCommas(payroll?.totalSalary)}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Net Amount</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-800">
                        ${formatNumberWithCommas(payroll?.tax)}
                      </p>
                    </div>
                  </div>

                  {/* Employee Count */}
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Employees Paid</span>
                    </div>
                    <p className="text-base font-medium text-gray-700">
                      {payroll?.employeeCount} {payroll?.employeeCount === 1 ? "employee" : "employees"}
                    </p>
                  </div>

                  {/* Date */}
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Payment Date</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {moment(payroll?.createdAt).format("LL")}
                    </p>
                  </div>

                  {/* Transaction Hash */}
                  <div>
                    <div className="text-gray-500 text-xs mb-1">
                      Transaction Hash
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono text-gray-600 truncate flex-1">
                        {payroll?.tx}
                      </p>
                      <a
                        href={`https://basescan.org/tx/${payroll?.tx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() =>
                      navigate(
                        `/workspace/${slug}/payroll/invoice?tx=${payroll?.tx}`
                      )
                    }
                    className="w-full text-sm bg-c-color rounded-lg px-4 py-2.5 font-medium text-white cursor-pointer hover:bg-c-bg transition-colors duration-200"
                  >
                    View Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="text-sm text-gray-600">
            Showing {filteredPayroll.length} of {payrolls?.length} payrolls
          </div>
        </>
      )}
    </div>
  );
}

