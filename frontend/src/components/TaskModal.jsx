import { useState, useEffect } from 'react';

const INITIAL = { title: '', description: '', status: 'pending' };

const TaskModal = ({ isOpen, onClose, onSubmit, editingTask, loading }) => {
  const [form, setForm] = useState(INITIAL);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description || '',
        status: editingTask.status,
      });
    } else {
      setForm(INITIAL);
    }
  }, [editingTask, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative card w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">
            {editingTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Title</label>
            <input
              id="task-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What needs to be done?"
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              id="task-description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Add more details (optional)"
              rows={3}
              className="input resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Status</label>
            <select
              id="task-status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="input"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              id="task-submit"
              className="btn-primary flex-1"
            >
              {loading ? 'Saving...' : editingTask ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
