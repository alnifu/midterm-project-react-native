import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import axios from 'axios';
import uuid from 'react-native-uuid';

// ✅ Updated Job interface
export interface Job {
  id: string;
  title: string;
  companyName: string;
  mainCategory: string;
  pubDate?: number;
  expiryDate?: number;
  companyLogo: string;
  jobType: string;
  workModel: string;
  seniorityLevel: string;
  minSalary?: number;
  maxSalary?: number;
}

interface JobContextType {
  savedJobs: Job[];
  jobs: Job[];
  filteredJobs: Job[];
  loading: boolean;
  loadingMore: boolean;
  loadMoreJobs: (pageNumber?: number) => void;
  fetchJobs: (pageNumber?: number, append?: boolean) => void;
  searchJobs: (text: string) => void;
  addJob: (job: Job) => void;
  removeJob: (jobId: string) => void;
}

export const JobContext = createContext<JobContextType>({
  savedJobs: [],
  jobs: [],
  filteredJobs: [],
  loading: false,
  loadingMore: false,
  loadMoreJobs: () => { },
  fetchJobs: () => { },
  searchJobs: () => { },
  addJob: () => { },
  removeJob: () => { },
});

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  // ✅ Fetch Jobs with Pagination
  const fetchJobs = useCallback(async (pageNumber = 1, append = false) => {
    if (loading || loadingMore) return;

    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await axios.get(
        `https://empllo.com/api/v1?page=${pageNumber}&limit=25`
      );

      if (Array.isArray(response.data.jobs)) {
        const jobsWithIds = response.data.jobs.map((job: any) => ({
          id: uuid.v4().toString(),
          title: job.title || 'No Title',
          mainCategory: job.mainCategory || 'Unknown',
          pubDate: Number(job.pubDate) ?? null,
          expiryDate: Number(job.expiryDate) ?? null,
          companyName: job.companyName || 'Unknown Company',
          jobType: job.jobType || 'Unknown',
          workModel: job.workModel || 'Unknown',
          seniorityLevel: job.seniorityLevel || 'Unspecified',
          minSalary: Number(job.minSalary) ?? null,
          maxSalary: Number(job.maxSalary) ?? null,
          companyLogo: job.companyLogo || '',
        }));

        if (append) {
          setJobs((prevJobs) => [...prevJobs, ...jobsWithIds]);
          setFilteredJobs((prevJobs) => [...prevJobs, ...jobsWithIds]);
        } else {
          setJobs(jobsWithIds);
          setFilteredJobs(jobsWithIds);
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }

    setLoading(false);
    setLoadingMore(false);
  }, []);

  // ✅ Load More Jobs - Updated
  const loadMoreJobs = async (pageNumber = page + 1) => {
    if (loadingMore || loading) return;

    setLoadingMore(true);
    setPage(pageNumber);
    await fetchJobs(pageNumber, true);

    // ✅ Reapply search after loading more jobs
    searchJobs('');
  };

  // ✅ Handle Search - Updated
  const searchJobs = (text: string) => {
    if (text === '') {
      setFilteredJobs(jobs);
    } else {
      const lowerCaseText = text.toLowerCase();

      const filtered = jobs.filter((job) =>
        [
          job.title,
          job.companyName,
          job.mainCategory,
          job.jobType,
          job.workModel,
          job.seniorityLevel,
        ]
          .some((field) => (field || '').toLowerCase().includes(lowerCaseText))
      );

      setFilteredJobs(filtered);
    }
  };

  // ✅ Save Job
  const addJob = (job: Job) => {
    setSavedJobs((prevJobs) => {
      if (prevJobs.find((j) => j.id === job.id)) {
        return prevJobs;
      }
      return [...prevJobs, job];
    });
  };

  // ✅ Remove Job
  const removeJob = (jobId: string) => {
    setSavedJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  };

  // ✅ Auto-fetch on mount
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <JobContext.Provider
      value={{
        savedJobs,
        jobs,
        filteredJobs,
        loading,
        loadingMore,
        loadMoreJobs,
        fetchJobs,
        searchJobs,
        addJob,
        removeJob,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
