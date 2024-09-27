import React from 'react';
import DashboardChart from '@/components/admin/dashboard-chart';
import leagueApiRequest from '@/apiRequests/league';

const DashboardPage: React.FC = async () => {
  // Fetch the actual data from the API
  // const dashboardData = await leagueApiRequest.getDashboardList();
  const dashboardData = {
    total_users: 100,
    active_users: 80,
    total_leagues: 50,
    active_leagues: 40,
    total_groups: 20,
    active_groups: 15,
  };

  const chartData = {
    users: [dashboardData.active_users, dashboardData.total_users - dashboardData.active_users],
    leagues: [dashboardData.active_leagues, dashboardData.total_leagues - dashboardData.active_leagues],
    groups: [dashboardData.active_groups, dashboardData.total_groups - dashboardData.active_groups],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <DashboardChart data={chartData} />
      </div>
      {/* Add more dashboard components here */}
    </div>
  );
};

export default DashboardPage;