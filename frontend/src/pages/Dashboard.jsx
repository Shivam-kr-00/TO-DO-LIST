import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../services/api';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const FILTERS = ['all', 'pending', 'in-progress', 'completed'];

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (filter !== 'all') params.status = filter;
      const res = await tasksAPI.getAll(params);
      setTasks(res.data.tasks);
      setTotalPages(res.totalPages);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      if (editingTask) {
        await tasksAPI.update(editingTask._id, form);
        showToast('Task updated');
      } else {
        await tasksAPI.create(form);
        showToast('Task created');
      }
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksAPI.delete(id);
      showToast('Task deleted');
      fetchTasks();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#111827]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-white">
              {user?.role === 'admin' ? 'All Tasks' : 'My Tasks'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {user?.role === 'admin' ? 'Viewing all users tasks' : 'Your personal task list'}
            </p>
          </div>
          <button
            id="create-task-btn"
            onClick={openCreate}
            className="btn-primary"
          >
            + New Task
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-5 border-b border-[#374151] pb-4">
          {FILTERS.map((f) => (
            <button
              key={f}
              id={`filter-${f}`}
              onClick={() => setFilter(f)}
              className={`text-sm px-3 py-1 rounded transition-colors ${
                filter === f
                  ? 'bg-[#1f2937] text-white border border-[#374151]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-gray-500 text-sm">No tasks found.</p>
            <button
              onClick={openCreate}
              className="mt-3 text-green-400 hover:text-green-300 text-sm"
            >
              Create your first task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-ghost disabled:opacity-30 text-sm px-3 py-1"
            >
              Previous
            </button>
            <span className="text-gray-500 text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-ghost disabled:opacity-30 text-sm px-3 py-1"
            >
              Next
            </button>
          </div>
        )}
      </main>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editingTask={editingTask}
        loading={submitting}
      />

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-2 rounded text-sm border ${
            toast.type === 'error'
              ? 'bg-red-950 border-red-800 text-red-300'
              : 'bg-[#1f2937] border-[#374151] text-gray-200'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
