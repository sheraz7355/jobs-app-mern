import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const CreateJob = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    salary: '',
    location: '',
    schedule: 'Full Time',
    url: '',
    featured: false,
    tags: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/jobs', formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create a New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-900 text-red-200 p-3 rounded">
            {error}
          </div>
        )}
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="CEO"
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white focus:outline-none focus:border-blue-700"
          />
        </div>
        <div>
          <label className="block mb-2">Salary</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="$50,000"
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white focus:outline-none focus:border-blue-700"
          />
        </div>
        <div>
          <label className="block mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Remote"
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white focus:outline-none focus:border-blue-700"
          />
        </div>
        <div>
          <label className="block mb-2">Schedule</label>
          <select
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white focus:outline-none focus:border-blue-700"
          >
            <option>Full Time</option>
            <option>Part Time</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">URL</label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="http://www.example.com/"
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white focus:outline-none focus:border-blue-700"
          />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Is this a featured job?</span>
          </label>
        </div>
        <div className="border-t border-gray-800 pt-4">
          <label className="block mb-2">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Laracasts, Educational, Xinjiang"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white focus:outline-none focus:border-blue-700"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-800 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

export default CreateJob;

