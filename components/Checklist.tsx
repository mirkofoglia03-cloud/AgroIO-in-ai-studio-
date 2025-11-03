import React, { useState } from 'react';
import { MOCK_TASKS } from '../constants';
import type { Task, TaskSuggestion } from '../types';
import { TaskModal } from './TaskModal';
import { PlusIcon, ChecklistIcon as TaskIcon } from './Icons';

// Sub-component for a single suggestion item
const SuggestionItem: React.FC<{ suggestion: TaskSuggestion }> = ({ suggestion }) => {
    const isWarning = suggestion.type === 'warning';
    const bgColor = isWarning ? 'bg-red-50' : 'bg-blue-50';
    const borderColor = isWarning ? 'border-red-400' : 'border-blue-400';
    const textColor = isWarning ? 'text-red-800' : 'text-blue-800';
    const Icon = suggestion.icon;

    return (
        <div className={`p-4 rounded-lg flex items-start ${bgColor} border-l-4 ${borderColor}`}>
            <Icon className={`w-6 h-6 mr-4 flex-shrink-0 mt-1 ${textColor}`} />
            <div>
                <h4 className={`font-bold ${textColor}`}>{suggestion.title}</h4>
                <p className={`text-sm ${isWarning ? 'text-red-700' : 'text-blue-700'}`}>{suggestion.reason}</p>
            </div>
        </div>
    );
};

// Sub-component for the suggestions section
const TaskSuggestions: React.FC<{ suggestions: TaskSuggestion[] }> = ({ suggestions }) => {
    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold text-agro-green mb-3">Consigliati dal Meteo</h3>
            <div className="space-y-3">
                {suggestions.map((s, index) => (
                    <SuggestionItem key={index} suggestion={s} />
                ))}
            </div>
        </div>
    );
};

// Sub-component for a single task item
const TaskItem: React.FC<{ task: Task; onToggle: (id: number) => void; onSelect: (task: Task) => void; }> = ({ task, onToggle, onSelect }) => {
    return (
        <div
            className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4"
            style={{ borderColor: task.completed ? '#22c55e' : '#a47e64' }}
            onClick={() => onSelect(task)}
        >
            <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => {
                    e.stopPropagation(); // Prevent opening modal when clicking checkbox
                    onToggle(task.id);
                }}
                className="h-5 w-5 rounded border-gray-300 text-agro-green focus:ring-agro-green-light"
            />
            <div className="ml-4 flex-1">
                <p className={`text-agro-green ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                </p>
                <p className="text-sm text-gray-500">{task.dueDate}</p>
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${task.category === 'Daily' ? 'bg-blue-100 text-blue-800' : task.category === 'Weekly' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                {task.category}
            </div>
        </div>
    );
};


// =================================================================
// CHECKLIST COMPONENT
// =================================================================
export const Checklist: React.FC<{ suggestions: TaskSuggestion[] }> = ({ suggestions }) => {
    const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const handleOpenModalForNew = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const handleSelectTask = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleToggleCompletion = (taskId: number) => {
        setTasks(prev =>
            prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
        );
    };

    const handleSaveTask = (taskData: Omit<Task, 'id' | 'completed' | 'category'>, id?: number) => {
        if (id) {
            // Update existing task
            setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...taskData } : t)));
        } else {
            // Add new task
            const newTask: Task = {
                id: Math.max(...tasks.map(t => t.id), 0) + 1,
                ...taskData,
                completed: false,
                category: 'General', // Default category for new tasks
            };
            setTasks(prev => [...prev, newTask]);
        }
        setIsModalOpen(false);
    };

    const handleDeleteTask = (taskId: number) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        setIsModalOpen(false);
    };

    const pendingTasks = tasks.filter(task => !task.completed).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    const completedTasks = tasks.filter(task => task.completed).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-agro-green">Le Mie Attività</h2>
                    <p className="text-agro-brown mt-1 font-serif">Organizza, programma e traccia il tuo lavoro.</p>
                </div>
                <button
                    onClick={handleOpenModalForNew}
                    className="flex items-center bg-agro-green text-white font-bold py-2 px-4 rounded-lg hover:bg-agro-green-light transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Aggiungi Attività
                </button>
            </div>

            <TaskSuggestions suggestions={suggestions} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Tasks Column */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-agro-green border-b-2 border-agro-beige pb-2">Da Fare ({pendingTasks.length})</h3>
                    {pendingTasks.length > 0 ? (
                        pendingTasks.map(task => (
                            <TaskItem key={task.id} task={task} onToggle={handleToggleCompletion} onSelect={handleSelectTask} />
                        ))
                    ) : (
                        <div className="text-center py-8 px-4 bg-white rounded-xl shadow-sm">
                            <TaskIcon className="w-16 h-16 mx-auto text-agro-gray" />
                            <p className="mt-4 text-agro-brown font-serif">Ottimo lavoro! Nessuna attività in sospeso.</p>
                        </div>
                    )}
                </div>

                {/* Completed Tasks Column */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-agro-green border-b-2 border-agro-beige pb-2">Completate ({completedTasks.length})</h3>
                    {completedTasks.length > 0 ? (
                       completedTasks.map(task => (
                            <TaskItem key={task.id} task={task} onToggle={handleToggleCompletion} onSelect={handleSelectTask} />
                        ))
                    ) : (
                         <div className="text-center py-8 px-4 bg-white rounded-xl shadow-sm">
                            <TaskIcon className="w-16 h-16 mx-auto text-agro-gray" />
                            <p className="mt-4 text-agro-brown font-serif">Nessuna attività completata di recente.</p>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveTask}
                    onDelete={handleDeleteTask}
                    onToggleComplete={handleToggleCompletion}
                    task={selectedTask}
                    selectedDate={selectedTask ? null : new Date()}
                />
            )}
        </div>
    );
};
