const STATUS_STYLES = {
  pending: 'bg-yellow-900 text-yellow-300 border-yellow-700',
  'in-progress': 'bg-blue-900 text-blue-300 border-blue-700',
  completed: 'bg-green-900 text-green-300 border-green-700',
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const date = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="card p-4 hover:border-gray-500 transition-colors group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-sm font-medium truncate mb-1">{task.title}</h3>
          {task.description && (
            <p className="text-gray-400 text-xs line-clamp-2 mb-3">{task.description}</p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded border font-medium ${STATUS_STYLES[task.status]}`}>
              {task.status}
            </span>
            <span className="text-gray-600 text-xs">{date}</span>
            {task.createdBy?.name && (
              <span className="text-gray-600 text-xs">by {task.createdBy.name}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded text-gray-500 hover:text-white hover:bg-[#374151] transition-colors"
            title="Edit task"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded text-gray-500 hover:text-red-400 hover:bg-red-950 transition-colors"
            title="Delete task"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
