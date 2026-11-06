import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Calendar,
  MessageSquare,
  Send,
  User,
  Filter,
  Search,
  Check,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Info,
  Layers,
  Flag,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AppTask, TaskPriority, TaskStatus, TaskType, ManagerAccount } from '../../types';

export const TaskManagerHub: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    addTaskNote,
    managers,
    showToast,
  } = useStore();

  // Mode: personal tasks vs manager delegated tasks
  const [activeViewMode, setActiveViewMode] = useState<'admin_self' | 'manager_assigned'>('manager_assigned');

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [selectedManagerFilter, setSelectedManagerFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Quick Reply dialog state for Admin to reply to a manager's note
  const [activeReplyTaskId, setActiveReplyTaskId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyStatusUpdate, setReplyStatusUpdate] = useState<TaskStatus | ''>('');

  // Add Task Form state
  const [newTaskForm, setNewTaskForm] = useState<{
    title: string;
    description: string;
    category: string;
    priority: TaskPriority;
    deadlineDate: string;
    deadlineTime: string;
    assignedToManagerId: string;
    initialNote: string;
  }>({
    title: '',
    description: '',
    category: 'Catalog & Uploads',
    priority: 'high',
    deadlineDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    deadlineTime: '18:00',
    assignedToManagerId: managers[0]?.id || '',
    initialNote: '',
  });

  // Calculate word count helper
  const countWords = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  };

  // Reply word count
  const replyWordCount = countWords(replyMessage);

  // Filter tasks based on view mode and filter bars
  const filteredTasks = tasks.filter((t) => {
    if (t.type !== activeViewMode) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (activeViewMode === 'manager_assigned' && selectedManagerFilter !== 'all') {
      if (t.assignedToManagerId !== selectedManagerFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchCategory = t.category.toLowerCase().includes(q);
      const matchMgr = t.assignedToManagerName?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCategory && !matchMgr) return false;
    }
    return true;
  });

  // Stats calculation
  const personalTasks = tasks.filter((t) => t.type === 'admin_self');
  const managerTasks = tasks.filter((t) => t.type === 'manager_assigned');

  const personalPending = personalTasks.filter((t) => t.status !== 'completed').length;
  const personalCompleted = personalTasks.filter((t) => t.status === 'completed').length;

  const managerPending = managerTasks.filter((t) => t.status !== 'completed').length;
  const managerBlocked = managerTasks.filter((t) => t.status === 'blocked').length;
  const managerCompleted = managerTasks.filter((t) => t.status === 'completed').length;

  // Deadline calculation
  const getDeadlineStatus = (dateStr: string, timeStr?: string) => {
    try {
      const now = new Date();
      const [year, month, day] = dateStr.split('-').map(Number);
      let [hours, minutes] = [23, 59];
      if (timeStr && timeStr.includes(':')) {
        [hours, minutes] = timeStr.split(':').map(Number);
      }
      const deadline = new Date(year, month - 1, day, hours, minutes);
      const diffMs = deadline.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 0) {
        return { label: 'Overdue', color: 'bg-red-50 text-red-700 border-red-200 font-bold', isUrgent: true };
      } else if (diffHours <= 24) {
        return { label: 'Due Today', color: 'bg-amber-50 text-amber-800 border-amber-200 font-bold', isUrgent: true };
      } else if (diffHours <= 48) {
        return { label: 'Due Tomorrow', color: 'bg-yellow-50 text-yellow-800 border-yellow-200', isUrgent: false };
      } else {
        const days = Math.ceil(diffHours / 24);
        return { label: `In ${days} days`, color: 'bg-stone-50 text-stone-700 border-stone-200', isUrgent: false };
      }
    } catch {
      return { label: dateStr, color: 'bg-stone-50 text-stone-600 border-stone-200', isUrgent: false };
    }
  };

  // Priority badge styling
  const renderPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-300">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
            Urgent Priority
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
            Medium Priority
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
            Standard
          </span>
        );
    }
  };

  // Status badge styling
  const renderStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case 'blocked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Blocked / Needs Answer
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-700" />
            In Progress
          </span>
        );
      case 'todo':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-300">
            To Do
          </span>
        );
    }
  };

  // Handle creating a task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.title.trim()) {
      showToast('Please enter a task title', 'error');
      return;
    }
    if (!newTaskForm.deadlineDate) {
      showToast('Please select a deadline date', 'error');
      return;
    }

    const assignedMgr =
      activeViewMode === 'manager_assigned'
        ? managers.find((m) => m.id === newTaskForm.assignedToManagerId)
        : null;

    addTask({
      type: activeViewMode,
      title: newTaskForm.title.trim(),
      description: newTaskForm.description.trim(),
      category: newTaskForm.category || 'General',
      priority: newTaskForm.priority,
      status: 'todo',
      deadlineDate: newTaskForm.deadlineDate,
      deadlineTime: newTaskForm.deadlineTime || '18:00',
      assignedToManagerId: assignedMgr?.id,
      assignedToManagerName: assignedMgr ? assignedMgr.name : undefined,
      assignedBy: 'Admin',
      initialNote: newTaskForm.initialNote.trim() || undefined,
    });

    setIsAddModalOpen(false);
    setNewTaskForm({
      title: '',
      description: '',
      category: 'Catalog & Uploads',
      priority: 'high',
      deadlineDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      deadlineTime: '18:00',
      assignedToManagerId: managers[0]?.id || '',
      initialNote: '',
    });
  };

  // Handle Admin replying to manager's progress/blocker report
  const handleSendAdminReply = (taskId: string) => {
    if (!replyMessage.trim()) {
      showToast('Please enter a resolution message', 'error');
      return;
    }
    if (replyWordCount > 100) {
      showToast('Message exceeds 100 words limit. Please shorten.', 'error');
      return;
    }

    addTaskNote(taskId, {
      authorRole: 'admin',
      authorName: 'Admin',
      message: replyMessage.trim(),
      noteType: 'resolution',
      statusUpdate: (replyStatusUpdate as TaskStatus) || undefined,
    });

    setReplyMessage('');
    setReplyStatusUpdate('');
    setActiveReplyTaskId(null);
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Top Header Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Operations Workflow & Delegation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
              Task Command & Manager Delegation
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Track your personal executive deadlines and delegate section duties to store managers with priority levels, deadline countdowns, and official 100-word progress & problem resolution reports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#b38f2a] hover:from-[#e5bf43] hover:to-[#c49f34] text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>
                {activeViewMode === 'admin_self' ? '+ Create Personal Task' : '+ Delegate Task to Manager'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* View Switcher: Personal Tasks vs Manager Delegated Tasks */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-3 bg-stone-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => {
              setActiveViewMode('manager_assigned');
              setStatusFilter('all');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeViewMode === 'manager_assigned'
                ? 'bg-stone-900 text-amber-300 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>Manager Delegated Tasks</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeViewMode === 'manager_assigned'
                  ? 'bg-amber-400/20 text-amber-200'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {managerTasks.length}
            </span>
            {managerBlocked > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title={`${managerBlocked} tasks blocked / need answer`} />
            )}
          </button>

          <button
            onClick={() => {
              setActiveViewMode('admin_self');
              setStatusFilter('all');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeViewMode === 'admin_self'
                ? 'bg-stone-900 text-amber-300 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>My Personal Tasks</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeViewMode === 'admin_self'
                  ? 'bg-amber-400/20 text-amber-200'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {personalTasks.length}
            </span>
          </button>
        </div>

        {/* Quick KPI stats pill strip */}
        <div className="flex items-center gap-3 text-xs text-stone-600">
          {activeViewMode === 'manager_assigned' ? (
            <>
              <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-lg font-semibold text-[11px]">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>{managerPending} Active</span>
              </span>
              {managerBlocked > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-300 text-rose-800 px-2.5 py-1 rounded-lg font-bold text-[11px] animate-pulse">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  <span>{managerBlocked} Need Answer</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-lg font-semibold text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{managerCompleted} Completed</span>
              </span>
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-lg font-semibold text-[11px]">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>{personalPending} Incomplete</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-lg font-semibold text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{personalCompleted} Completed</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter tabs */}
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mr-1">Status:</span>
          {(['all', 'todo', 'in_progress', 'blocked', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              {st === 'all' ? 'All Statuses' : st === 'blocked' ? 'Blocked / Attention' : st.replace('_', ' ')}
            </button>
          ))}

          {/* Priority filter */}
          <div className="h-4 w-px bg-stone-200 mx-1 hidden sm:block" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mr-1">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="p-1 px-2 border border-stone-200 rounded-lg bg-stone-50 font-medium text-stone-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Standard / Low</option>
          </select>

          {/* Manager filter if in manager mode */}
          {activeViewMode === 'manager_assigned' && (
            <>
              <div className="h-4 w-px bg-stone-200 mx-1 hidden sm:block" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mr-1">Manager:</span>
              <select
                value={selectedManagerFilter}
                onChange={(e) => setSelectedManagerFilter(e.target.value)}
                className="p-1 px-2 border border-stone-200 rounded-lg bg-stone-50 font-medium text-stone-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">All Managers ({managers.length})</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.roleTitle})
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-8 pr-3 py-1.5 border border-stone-200 rounded-lg text-xs bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 font-medium"
          />
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center max-w-md mx-auto shadow-xs space-y-3">
          <CheckSquare className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No tasks found</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try resetting the filters or clearing your search term.'
              : activeViewMode === 'admin_self'
              ? 'You do not have any personal tasks created yet. Click "+ Create Personal Task" above.'
              : 'No manager tasks currently delegated. Click "+ Delegate Task to Manager" above.'}
          </p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setPriorityFilter('all');
              setSelectedManagerFilter('all');
              setSearchQuery('');
            }}
            className="text-xs text-amber-800 font-bold hover:underline cursor-pointer pt-1"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const deadlineStatus = getDeadlineStatus(task.deadlineDate, task.deadlineTime);
            const managerNote = task.notes.filter((n) => n.authorRole === 'manager').slice(-1)[0];
            const adminResolution = task.notes.filter((n) => n.authorRole === 'admin' && n.noteType === 'resolution').slice(-1)[0];

            return (
              <div
                key={task.id}
                className={`bg-white border rounded-2xl p-5 shadow-xs transition-all relative ${
                  isCompleted
                    ? 'border-emerald-200/80 bg-emerald-50/20 opacity-85'
                    : task.status === 'blocked'
                    ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/10'
                    : 'border-stone-200 hover:border-amber-300'
                }`}
              >
                {/* Header Row: Checkbox, Title, Badges */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-start gap-3">
                    {/* Toggle completion button */}
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'border-2 border-stone-300 hover:border-amber-500 bg-white'
                      }`}
                      title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                          {task.category}
                        </span>
                        <span>·</span>
                        {renderPriorityBadge(task.priority)}
                        {renderStatusBadge(task.status)}
                      </div>

                      <h4
                        className={`text-base font-bold text-stone-900 leading-snug ${
                          isCompleted ? 'line-through text-stone-400' : ''
                        }`}
                      >
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right side: Assignee & Deadline */}
                  <div className="flex flex-col sm:items-end gap-1.5 shrink-0 sm:pl-4">
                    {task.type === 'manager_assigned' && task.assignedToManagerName && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-lg">
                        <User className="w-3 h-3 text-amber-600" />
                        <span>Assigned to: <strong className="text-amber-900">{task.assignedToManagerName}</strong></span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-stone-400">Deadline:</span>
                      <span className={`px-2 py-0.5 rounded border text-[11px] ${deadlineStatus.color}`}>
                        📅 {task.deadlineDate} {task.deadlineTime && `· ${task.deadlineTime}`} ({deadlineStatus.label})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress / Blocker Message Trail (Max 100 words dialogue) */}
                {task.type === 'manager_assigned' && (
                  <div className="mt-4 pt-3 space-y-3">
                    {/* Latest Manager Report (What they did or Problem faced) */}
                    {managerNote ? (
                      <div
                        className={`rounded-xl p-3.5 border text-xs space-y-1.5 ${
                          managerNote.noteType === 'blocker'
                            ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                            : 'bg-amber-50/50 border-amber-200 text-stone-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 pb-1 border-b border-stone-200/60">
                          <div className="flex items-center gap-2 font-bold text-[11px]">
                            {managerNote.noteType === 'blocker' ? (
                              <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-100 px-2 py-0.2 rounded font-bold uppercase tracking-wider text-[10px]">
                                <AlertTriangle className="w-3 h-3" />
                                Blocker Reported by Manager
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100 px-2 py-0.2 rounded font-bold uppercase tracking-wider text-[10px]">
                                <Clock className="w-3 h-3" />
                                Progress Update from Manager
                              </span>
                            )}
                            <span className="text-stone-500 font-normal">({managerNote.authorName})</span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-stone-500">
                            <span>{managerNote.wordCount} / 100 words</span>
                            <span>·</span>
                            <span>{managerNote.createdAt}</span>
                          </div>
                        </div>

                        <p className="leading-relaxed text-xs italic font-medium">
                          &ldquo;{managerNote.message}&rdquo;
                        </p>
                      </div>
                    ) : (
                      <div className="text-[11px] text-stone-400 italic flex items-center gap-1.5">
                        <Info className="w-3 h-3 text-stone-400" />
                        <span>No progress or blocker report submitted by manager yet.</span>
                      </div>
                    )}

                    {/* Admin Resolution / Answer if already given */}
                    {adminResolution && (
                      <div className="rounded-xl p-3.5 bg-emerald-50/70 border border-emerald-200 text-xs space-y-1.5">
                        <div className="flex items-center justify-between gap-2 pb-1 border-b border-emerald-200/60">
                          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded font-bold uppercase tracking-wider text-[10px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Admin Official Answer & Resolution
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-stone-500">
                            <span>{adminResolution.wordCount} / 100 words</span>
                            <span>·</span>
                            <span>{adminResolution.createdAt}</span>
                          </div>
                        </div>

                        <p className="leading-relaxed text-xs font-semibold text-emerald-950">
                          {adminResolution.message}
                        </p>
                      </div>
                    )}

                    {/* Inline Reply Box for Admin */}
                    {activeReplyTaskId === task.id ? (
                      <div className="bg-stone-50 border border-amber-300 rounded-xl p-3.5 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-900 flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                            <span>Reply to Manager / Provide Solution (Max 100 words)</span>
                          </span>
                          <span
                            className={`font-mono text-[11px] font-bold ${
                              replyWordCount > 100 ? 'text-red-600' : 'text-stone-500'
                            }`}
                          >
                            {replyWordCount} / 100 words
                          </span>
                        </div>

                        <textarea
                          rows={2}
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="e.g. Approved to proceed with existing batches. Contacted Dehradun studio to send remaining photos by 3 PM..."
                          className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 font-medium"
                        />

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-stone-500 text-[11px]">Update task status to:</span>
                            <select
                              value={replyStatusUpdate}
                              onChange={(e) => setReplyStatusUpdate(e.target.value as any)}
                              className="p-1 px-2 border border-stone-200 rounded-md bg-white text-xs font-medium text-stone-700"
                            >
                              <option value="">Keep Current Status ({task.status})</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Mark Completed</option>
                              <option value="blocked">Keep Blocked</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setActiveReplyTaskId(null);
                                setReplyMessage('');
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-200 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSendAdminReply(task.id)}
                              disabled={replyWordCount === 0 || replyWordCount > 100}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                                replyWordCount === 0 || replyWordCount > 100
                                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                                  : 'bg-stone-900 hover:bg-black text-amber-300 shadow-xs'
                              }`}
                            >
                              <Send className="w-3 h-3" />
                              <span>Submit Resolution</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => {
                            setActiveReplyTaskId(task.id);
                            setReplyMessage('');
                            setReplyStatusUpdate(task.status === 'blocked' ? 'in_progress' : '');
                          }}
                          className="text-xs font-bold text-amber-800 hover:text-amber-900 inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                          <span>
                            {adminResolution ? 'Update Admin Resolution' : 'Answer / Provide Solution to Manager'}
                          </span>
                        </button>

                        <div className="flex items-center gap-2">
                          <select
                            value={task.status}
                            onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                            className="p-1 px-2 border border-stone-200 rounded-lg bg-stone-50 text-xs font-semibold text-stone-700 cursor-pointer"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="blocked">Blocked / Needs Answer</option>
                            <option value="completed">Completed</option>
                          </select>

                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Personal task action row */}
                {task.type === 'admin_self' && (
                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <select
                        value={task.status}
                        onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                        className="p-1 px-2 border border-stone-200 rounded-lg bg-stone-50 text-xs font-semibold text-stone-700 cursor-pointer"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>

                      <select
                        value={task.priority}
                        onChange={(e) => updateTask(task.id, { priority: e.target.value as TaskPriority })}
                        className="p-1 px-2 border border-stone-200 rounded-lg bg-stone-50 text-xs font-semibold text-stone-700 cursor-pointer"
                      >
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Standard</option>
                      </select>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Personal Task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {activeViewMode === 'admin_self' ? 'Create Personal Admin Task' : 'Delegate New Task to Manager'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {activeViewMode === 'admin_self'
                      ? 'Keep track of your own executive deadlines and atelier milestones'
                      : 'Assign a targeted section workflow to a specific manager'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              {/* If Manager Mode, select Manager */}
              {activeViewMode === 'manager_assigned' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Assign to Manager *
                  </label>
                  <select
                    value={newTaskForm.assignedToManagerId}
                    onChange={(e) =>
                      setNewTaskForm({ ...newTaskForm, assignedToManagerId: e.target.value })
                    }
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
                  >
                    {managers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} — {m.roleTitle} ({m.permissions.length} duties)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  placeholder={
                    activeViewMode === 'admin_self'
                      ? 'e.g. Audit 22K Gold Plating Certification & BIS Karigar Agreement'
                      : 'e.g. Upload 12 New Kundan Choker Sets with 3 Color Variants'
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Category / Department
                  </label>
                  <select
                    value={newTaskForm.category}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, category: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-medium text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Catalog & Uploads">Catalog & Uploads</option>
                    <option value="Order Fulfillment">Order Fulfillment</option>
                    <option value="Marketing & Campaigns">Marketing & Campaigns</option>
                    <option value="Customer Reviews">Customer Reviews</option>
                    <option value="Homepage Banners">Homepage Banners</option>
                    <option value="Flash Deals & Offers">Flash Deals & Offers</option>
                    <option value="Finance & Compliance">Finance & Compliance</option>
                    <option value="Store Operations">Store Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Priority Level *
                  </label>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) =>
                      setNewTaskForm({ ...newTaskForm, priority: e.target.value as TaskPriority })
                    }
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-bold text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="urgent">🔴 Urgent Priority</option>
                    <option value="high">🟠 High Priority</option>
                    <option value="medium">🔵 Medium Priority</option>
                    <option value="low">⚪ Standard Priority</option>
                  </select>
                </div>
              </div>

              {/* Deadline Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Deadline Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newTaskForm.deadlineDate}
                    onChange={(e) =>
                      setNewTaskForm({ ...newTaskForm, deadlineDate: e.target.value })
                    }
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-semibold text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                  </input>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Deadline Time
                  </label>
                  <input
                    type="time"
                    value={newTaskForm.deadlineTime}
                    onChange={(e) =>
                      setNewTaskForm({ ...newTaskForm, deadlineTime: e.target.value })
                    }
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-semibold text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Description / Instructions */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Detailed Instructions / Brief
                </label>
                <textarea
                  rows={3}
                  value={newTaskForm.description}
                  onChange={(e) =>
                    setNewTaskForm({ ...newTaskForm, description: e.target.value })
                  }
                  placeholder="Explain exactly what needs to be delivered, quality guidelines, or key references..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Initial Admin Note */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Initial Guidance Note (Optional)
                </label>
                <input
                  type="text"
                  value={newTaskForm.initialNote}
                  onChange={(e) =>
                    setNewTaskForm({ ...newTaskForm, initialNote: e.target.value })
                  }
                  placeholder="e.g. High-res imagery available on studio drive folder"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 text-stone-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-900 hover:bg-black text-amber-300 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {activeViewMode === 'admin_self' ? 'Save Personal Task' : 'Assign to Manager'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
