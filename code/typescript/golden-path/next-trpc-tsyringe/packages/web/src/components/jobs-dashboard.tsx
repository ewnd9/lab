import { useState } from 'react';
import { api } from '~/utils/api';

const STATE_COLORS = {
  created: 'bg-blue-100 text-blue-800',
  retry: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-gray-100 text-gray-800',
  failed: 'bg-red-100 text-red-800',
};

const STATE_LABELS = {
  created: 'Created',
  retry: 'Retry',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
  failed: 'Failed',
};

type JobState = keyof typeof STATE_COLORS;

export function JobsDashboard() {
  const [selectedState, setSelectedState] = useState<JobState | undefined>();
  const [_refreshKey, setRefreshKey] = useState(0);

  const { data: stats, refetch: refetchStats } = api.jobs.getStats.useQuery(undefined, {
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { data: recentJobs, refetch: refetchJobs } = api.jobs.getRecentJobs.useQuery({
    limit: 50,
    state: selectedState,
  });

  const { data: failedJobs } = api.jobs.getFailedJobs.useQuery({ limit: 10 });
  const { data: activeJobs } = api.jobs.getActiveJobs.useQuery();
  const { data: queues } = api.jobs.getQueues.useQuery();

  const cancelJobMutation = api.jobs.cancelJob.useMutation({
    onSuccess: () => {
      refetchJobs();
      refetchStats();
    },
  });

  const retryJobMutation = api.jobs.retryJob.useMutation({
    onSuccess: () => {
      refetchJobs();
      refetchStats();
    },
  });

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    refetchStats();
    refetchJobs();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Jobs Dashboard</h1>
        <button onClick={handleRefresh} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-gray-900">{stats?.total || 0}</div>
          <div className="text-sm text-gray-600">Total Jobs</div>
        </div>

        {stats?.byState.map((stat: any) => (
          <div
            key={stat.state}
            className={`p-4 rounded-lg shadow border cursor-pointer transition-all ${
              selectedState === stat.state ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedState(selectedState === stat.state ? undefined : (stat.state as JobState))}
          >
            <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
            <div className={`text-sm px-2 py-1 rounded-full inline-block ${STATE_COLORS[stat.state as JobState]}`}>
              {STATE_LABELS[stat.state as JobState]}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Jobs */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Active Jobs ({activeJobs?.length || 0})</h2>
          </div>
          <div className="p-6">
            {activeJobs && activeJobs.length > 0 ? (
              <div className="space-y-3">
                {activeJobs.map((job: any) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{job.name}</div>
                        <div className="text-sm text-gray-600">
                          Started: {new Date(job.started_on).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => cancelJobMutation.mutate({ id: job.id, name: job.name })}
                        className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                        disabled={cancelJobMutation.isPending}
                      >
                        Cancel
                      </button>
                    </div>
                    {job.data && (
                      <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(job.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">No active jobs</div>
            )}
          </div>
        </div>

        {/* Failed Jobs */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Failed Jobs</h2>
          </div>
          <div className="p-6">
            {failedJobs && failedJobs.length > 0 ? (
              <div className="space-y-3">
                {failedJobs.slice(0, 5).map((job: any) => (
                  <div key={job.id} className="border rounded-lg p-4 border-red-200 bg-red-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{job.name}</div>
                        <div className="text-sm text-gray-600">
                          Failed: {job.completed_on ? new Date(job.completed_on).toLocaleString() : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">
                          Retries: {job.retry_count || 0}/{job.retry_limit || 0}
                        </div>
                      </div>
                      <button
                        onClick={() => retryJobMutation.mutate({ id: job.id, name: job.name })}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                        disabled={retryJobMutation.isPending}
                      >
                        Retry
                      </button>
                    </div>
                    {job.output && (
                      <div className="mt-2 text-xs text-red-700 bg-red-100 p-2 rounded">
                        {JSON.stringify(job.output, null, 2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">No failed jobs</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Jobs {selectedState && `(${STATE_LABELS[selectedState]})`}
            </h2>
            {selectedState && (
              <button onClick={() => setSelectedState(undefined)} className="text-sm text-blue-600 hover:text-blue-800">
                Show All
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retries
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentJobs?.map((job: any) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900">{job.name}</div>
                      <div className="text-sm text-gray-500 font-mono">{job.id}</div>
                      {job.data && Object.keys(job.data).length > 0 && (
                        <details className="mt-1">
                          <summary className="text-xs text-blue-600 cursor-pointer">View Data</summary>
                          <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-x-auto">
                            {JSON.stringify(job.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${STATE_COLORS[job.state as JobState]}`}>
                      {STATE_LABELS[job.state as JobState]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{new Date(job.created_on).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{new Date(job.updated_on).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {job.retry_count || 0}/{job.retry_limit || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Queues */}
      {queues && queues.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Queue Configuration</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Policy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Retry Limit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Retention
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {queues.map((queue: any) => (
                  <tr key={queue.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{queue.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{queue.policy}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{queue.retry_limit}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{queue.retention_minutes}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
