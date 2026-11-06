import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Send,
  Check,
  Info,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  User,
  Filter,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AppTask, TaskStatus, TaskPriority } from '../../types';

interface ManagerTasksViewProps {
  managerId: string;
  managerName: string;
}

export const ManagerTasksView: React.FC<ManagerTasksViewProps> = ({
  managerId,
  managerName,
}) => {
  const { tasks, updateTask, toggleTaskStatus, addTaskNote, showToast } = useStore();

  // Filter tasks assigned to this manager
  const myTasks = tasks.filter(
    (t) => t.type === 'manager_assigned' && (t.assignedToManagerId === managerId || !t.assignedToManagerId)
  );

  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [activeReportTaskId, setActiveReportTaskId] = useState<string | null>(null);

  // Form for manager report
  const [reportType, setReportType] = useState<'progress' | 'blocker'>('progress');
  const [reportStatus, setReportStatus] = useState<TaskStatus>('in_progress');
  const [reportMessage, setReportMessage] = useState('');

  // Word count helper
  const countWords = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  };

  const reportWordCount = countWords(reportMessage);

  // Filtered tasks
  const filteredTasks = myTasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const pendingCount = myTasks.filter((t) => t.status !== 'completed').length;
  const blockedCount = myTasks.filter((t) => t.status === 'blocked').length;
  const completedCount = myTasks.filter((t) => t.status === 'completed').length;

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
        return { label: 'Overdue', color: 'bg-red-500/20 text-red-300 border-red-500/40 font-bold' };
      } else if (diffHours <= 24) {
        return { label: 'Due Today', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold' };
      } else if (diffHours <= 48) {
        return { label: 'Due Tomorrow', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' };
      } else {
        const days = Math.ceil(diffHours / 24);
        return { label: `In ${days} days`, color: 'bg-stone-800 text-stone-300 border-stone-700' };
      }
    } catch {
      return { label: dateStr, color: 'bg-stone-800 text-stone-300 border-stone-700' };
    }
  };

  const handleSendReport = (taskId: string) => {
    if (!reportMessage.trim()) {
      showToast('Please type your progress or blocker message', 'error');
      return;
    }
    if (reportWordCount > 100) {
      showToast('Message exceeds 100 words limit. Please shorten.', 'error');
      return;
    }

    addTaskNote(taskId, {
      authorRole: 'manager',
      authorName: managerName,
      message: reportMessage.trim(),
      noteType: reportType,
      statusUpdate: reportStatus,
    });

    setReportMessage('');
    setActiveReportTaskId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Assigned Workflows & Directives</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
              My Assigned Atelier Tasks
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Review tasks delegated to you by the Store Administrator. Post status reports or notify the Admin of any blockers in under 100 words to receive rapid guidance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-stone-950/80 border border-stone-800 px-4 py-2.5 rounded-xl flex items-center gap-4 text-xs">
              <div>
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Active</span>
                <span className="text-sm font-bold text-amber-400">{pendingCount}</span>
              </div>
              <div className="w-px h-6 bg-stone-800" />
              <div>
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Blocked</span>
                <span className="text-sm font-bold text-rose-400">{blockedCount}</span>
              </div>
              <div className="w-px h-6 bg-stone-800" />
              <div>
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Completed</span>
                <span className="text-sm font-bold text-emerald-400">{completedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-stone-400 font-bold uppercase tracking-wider text-[11px] mr-1">Filter:</span>
          {(['all', 'todo', 'in_progress', 'blocked', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-300'
              }`}
            >
              {st === 'all' ? 'All Tasks' : st === 'blocked' ? 'Need Admin Help' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
        <span className="text-stone-400 text-xs font-mono">
          Showing {filteredTasks.length} of {myTasks.length} tasks
        </span>
      </div>

      {/* Task Cards List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500/80 mx-auto" />
          <h3 className="text-base font-bold text-white">All caught up!</h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            {statusFilter !== 'all'
              ? 'No tasks found under this filter.'
              : 'You have no pending tasks assigned right now. When the Store Administrator delegates duties to you, they will appear here with instructions and deadlines.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const deadlineStatus = getDeadlineStatus(task.deadlineDate, task.deadlineTime);
            const managerNote = task.notes.filter((n) => n.authorRole === 'manager').slice(-1)[0];
            const adminResolution = task.notes
              .filter((n) => n.authorRole === 'admin' && n.noteType === 'resolution')
              .slice(-1)[0];

            return (
              <div
                key={task.id}
                className={`border rounded-2xl p-5 transition-all relative ${
                  isCompleted
                    ? 'bg-stone-900/60 border-stone-800 opacity-80'
                    : task.status === 'blocked'
                    ? 'bg-stone-900 border-rose-600/80 ring-1 ring-rose-500/30'
                    : 'bg-stone-900 border-stone-800 hover:border-amber-500/50'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-800">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-500 text-stone-950 font-bold'
                          : 'border-2 border-stone-600 hover:border-amber-400 bg-stone-950'
                      }`}
                      title={isCompleted ? 'Mark in progress' : 'Mark completed'}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1 text-[11px]">
                        <span className="text-amber-400 font-semibold uppercase tracking-wider">
                          {task.category}
                        </span>
                        <span className="text-stone-600">·</span>
                        <span
                          className={`px-2 py-0.5 rounded uppercase font-bold text-[10px] tracking-wider ${
                            task.priority === 'urgent'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                              : task.priority === 'high'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-stone-800 text-stone-300 border border-stone-700'
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : task.status === 'blocked'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                              : task.status === 'in_progress'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-stone-800 text-stone-300'
                          }`}
                        >
                          {task.status === 'blocked'
                            ? 'Need Admin Help'
                            : task.status === 'in_progress'
                            ? 'In Progress'
                            : isCompleted
                            ? 'Completed'
                            : 'To Do'}
                        </span>
                      </div>

                      <h4
                        className={`text-base font-bold text-white leading-snug ${
                          isCompleted ? 'line-through text-stone-500' : ''
                        }`}
                      >
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-xs text-stone-300 mt-1 max-w-3xl leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Deadline Box */}
                  <div className="shrink-0 text-left sm:text-right">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block mb-0.5">
                      Target Deadline
                    </span>
                    <span
                      className={`inline-block px-2.5 py-1 rounded border text-xs font-semibold ${deadlineStatus.color}`}
                    >
                      📅 {task.deadlineDate} {task.deadlineTime && `· ${task.deadlineTime}`} ({deadlineStatus.label})
                    </span>
                  </div>
                </div>

                {/* Progress / Blocker Message Trail */}
                <div className="mt-4 pt-2 space-y-3">
                  {/* Latest Manager Report */}
                  {managerNote && (
                    <div
                      className={`rounded-xl p-3.5 border text-xs space-y-1.5 ${
                        managerNote.noteType === 'blocker'
                          ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                          : 'bg-stone-950 border-stone-800 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 pb-1 border-b border-stone-800">
                        <span className="font-bold flex items-center gap-1.5 text-[11px]">
                          {managerNote.noteType === 'blocker' ? (
                            <span className="text-rose-400 flex items-center gap-1 font-bold">
                              <AlertTriangle className="w-3 h-3" />
                              Problem / Blocker You Reported
                            </span>
                          ) : (
                            <span className="text-amber-400 flex items-center gap-1 font-bold">
                              <Clock className="w-3 h-3" />
                              Your Progress Report
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-stone-500">
                          <span>{managerNote.wordCount} / 100 words</span>
                          <span>·</span>
                          <span>{managerNote.createdAt}</span>
                        </div>
                      </div>

                      <p className="leading-relaxed text-xs italic">&ldquo;{managerNote.message}&rdquo;</p>
                    </div>
                  )}

                  {/* Admin's Answer / Resolution */}
                  {adminResolution && (
                    <div className="rounded-xl p-3.5 bg-emerald-950/40 border border-emerald-800/80 text-xs space-y-1.5">
                      <div className="flex items-center justify-between gap-2 pb-1 border-b border-emerald-800/60">
                        <span className="inline-flex items-center gap-1 text-emerald-300 font-bold uppercase tracking-wider text-[10px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Admin Resolution & Guidance
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-stone-400">
                          <span>{adminResolution.wordCount} / 100 words</span>
                          <span>·</span>
                          <span>{adminResolution.createdAt}</span>
                        </div>
                      </div>

                      <p className="leading-relaxed text-xs font-semibold text-emerald-100">
                        {adminResolution.message}
                      </p>
                    </div>
                  )}

                  {/* Add On Report Form for Manager */}
                  {activeReportTaskId === task.id ? (
                    <div className="bg-stone-950 border border-amber-500/60 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                          <span>Submit Status or Report Problem to Admin (Max 100 words)</span>
                        </span>
                        <span
                          className={`font-mono text-[11px] font-bold ${
                            reportWordCount > 100 ? 'text-red-400' : 'text-amber-400'
                          }`}
                        >
                          {reportWordCount} / 100 words
                        </span>
                      </div>

                      {/* Pick Type */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setReportType('progress');
                            setReportStatus('in_progress');
                          }}
                          className={`p-2 rounded-lg border font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            reportType === 'progress'
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                              : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Progress / Completed Work</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setReportType('blocker');
                            setReportStatus('blocked');
                          }}
                          className={`p-2 rounded-lg border font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            reportType === 'blocker'
                              ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                              : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Report Problem / Blocker</span>
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        value={reportMessage}
                        onChange={(e) => setReportMessage(e.target.value)}
                        placeholder={
                          reportType === 'blocker'
                            ? 'Explain what problem or obstacle occurred (e.g. Courier boy refused pickup, photographer sent only half the batch, stock shortage)...'
                            : 'Summarize what progress you completed today (e.g. Uploaded 8 product variants, packed boxes, verified coupon code)...'
                        }
                        className="w-full text-xs p-2.5 rounded-lg border border-stone-800 bg-stone-900 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      />

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-stone-400 text-[11px]">Set task status:</span>
                          <select
                            value={reportStatus}
                            onChange={(e) => setReportStatus(e.target.value as any)}
                            className="p-1 px-2 border border-stone-800 rounded-md bg-stone-900 text-xs font-semibold text-white"
                          >
                            <option value="in_progress">In Progress</option>
                            <option value="blocked">Blocked / Need Help</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveReportTaskId(null);
                              setReportMessage('');
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-400 hover:text-white cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendReport(task.id)}
                            disabled={reportWordCount === 0 || reportWordCount > 100}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                              reportWordCount === 0 || reportWordCount > 100
                                ? 'bg-stone-800 text-stone-600 cursor-not-allowed'
                                : 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-xs'
                            }`}
                          >
                            <Send className="w-3 h-3" />
                            <span>Send Update to Admin</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button
                        onClick={() => {
                          setActiveReportTaskId(task.id);
                          setReportMessage('');
                          setReportType(task.status === 'blocked' ? 'blocker' : 'progress');
                          setReportStatus(task.status);
                        }}
                        className="text-xs font-bold text-amber-300 hover:text-white inline-flex items-center gap-1.5 bg-stone-800/80 hover:bg-stone-800 border border-stone-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        <span>Add Progress Note or Report Problem (Max 100 words)</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <select
                          value={task.status}
                          onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                          className="p-1 px-2 border border-stone-800 rounded-lg bg-stone-950 text-xs font-semibold text-stone-200 cursor-pointer"
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="blocked">Blocked / Need Help</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
