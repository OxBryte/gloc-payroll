import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetWorkspace } from "../hooks/useWorkspace";
import { useQueries } from "@tanstack/react-query";
import { getCookie } from "../lib/utils";

export default function HomeChart() {
  const { workspace } = useGetWorkspace();
  const apiURL = import.meta.env.VITE_API_URL;

  const payrollQueries = useQueries({
    queries:
      workspace?.map((ws) => ({
        queryKey: ["payrolls", ws._id],
        queryFn: async () => {
          const token = getCookie("token"); // or whatever your cookie name is

          const response = await fetch(`${apiURL}payroll/${ws._id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch payroll data");
          }
          return response.json();
        },
        enabled: !!ws._id && !!workspace,
        staleTime: 5 * 60 * 1000, // 5 minutes
      })) || [],
  });

  const chartData = useMemo(() => {
    if (!workspace || workspace.length === 0) return [];

    return workspace.map((ws, idx) => {
      const query = payrollQueries[idx];
      const payrollArray = query?.data?.data || [];

      // Calculate sum of all totalSalary values in the payroll array
      const totalSalarySum = Array.isArray(payrollArray)
        ? payrollArray.reduce((sum, payrollItem) => {
            // Handle different possible data structures
            const salary = payrollItem?.totalSalary || 0;

            // Ensure it's a valid number
            const validSalary =
              typeof salary === "number" && !isNaN(salary) ? salary : 0;
            return sum + validSalary;
          }, 0)
        : 0;

      return {
        name: ws.name || "Unnamed Workspace",
        totalEmployees: ws?.employees?.length || 0,
        total: totalSalarySum,
        workspaceId: ws._id,
        payrollCount: Array.isArray(payrollArray) ? payrollArray.length : 0,
      };
    });
  }, [workspace, payrollQueries]);

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Total Salary: ${data.total.toLocaleString()}
          </p>
          <p className="text-green-600">
            Total Employees: {data.totalEmployees}
          </p>
          <p className="text-gray-500 text-sm">
            Payroll Records: {data.payrollCount}
          </p>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis values
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };
  // Format Y-axis values for employee count
  const formatYAxisRight = (value) => {
    return value.toString();
  };

  return (
    <div className="w-full h-96 bg-white border border-gray-200 rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: "#e0e0e0" }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tickFormatter={formatYAxis}
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: "#e0e0e0" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={formatYAxisRight}
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: "#e0e0e0" }}
          />
          <Tooltip content={customTooltip} />
          <Legend />
                  <Bar
            yAxisId="left"
            type="monotone"
            dataKey="total"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            strokeWidth={2}
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          />
                  <Bar
            yAxisId="right"
            type="monotone"
            dataKey="totalEmployees"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            strokeWidth={2}
            activeBar={<Rectangle fill="gold" stroke="purple" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
