import { Link } from 'react-router-dom';

const JobCardWide = ({ job }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-blue-700 transition-colors">
      <div className="flex items-start gap-4">
        <img 
          src={`http://localhost:3001${job.employer_logo}`} 
          alt={job.employer_name}
          className="w-20 h-20 object-contain rounded"
        />
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">{job.title}</h3>
          <p className="text-gray-400 mb-2">{job.employer_name}</p>
          <p className="text-blue-400 mb-2">{job.salary}</p>
          <p className="text-gray-500 mb-3">{job.location} • {job.schedule}</p>
          {job.tags && job.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {job.tags.map(tag => (
                <Link
                  key={tag.id}
                  to={`/tags/${tag.name}`}
                  className="px-3 py-1 bg-blue-900 text-blue-300 rounded text-sm hover:bg-blue-800"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
          <a 
            href={job.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-blue-400 hover:text-blue-300 font-semibold"
          >
            Apply →
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobCardWide;

