import React, { useState, useEffect } from 'react';
import type { Task } from '../types';
import { CloseIcon, TrashIcon } from './Icons';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: { title: string; dueDate: string }, id?: number) => void;
  onDelete: (taskId: number) => void;
  onToggleComplete: (taskId: number) => void;
  task: Task | null;
  selectedDate: Date | null;
}

// =================================================================
// TASK MODAL COMPONENT
// =================================================================
export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, onDelete, onToggleComplete, task, selectedDate }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDueDate(task.dueDate);
    } else if (selectedDate) {
      setTitle('');
      setDueDate(selectedDate.toISOString().split('T')[0]);
    }
  }, [task, selectedDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Il titolo è obbligatorio.');
      return;
    }
    onSave({ title, dueDate }, task?.id);
  };

  const handleDelete = () => {
    if (task && window.confirm("Sei sicuro di voler eliminare questa attività?")) {
      onDelete(task.id);
    }
  };

  const handleToggle = () => {
    if (task) {
        onToggleComplete(task.id);
    }
  }

  const isNewTask = !task;
  const modalTitle = isNewTask ? 'Aggiungi Nuova Attività' : 'Modifica Attività';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md m-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-agro-green">{modalTitle}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-agro-gray-light">
            <CloseIcon className="w-6 h-6 text-agro-brown" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-agro-brown mb-1">
              Titolo Attività
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-agro-gray rounded-lg focus:ring-agro-green-light focus:border-agro-green-light"
              placeholder="Es. Irrigare i pomodori"
            />
          </div>
          
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-agro-brown mb-1">
              Data di Scadenza
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 border border-agro-gray rounded-lg focus:ring-agro-green-light focus:border-agro-green-light"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex justify-between items-center pt-4">
             <div>
                {!isNewTask && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="p-2 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                        aria-label="Elimina attività"
                    >
                        <TrashIcon className="w-6 h-6" />
                    </button>
                )}
             </div>
             <div className="flex space-x-4">
                {!isNewTask && (
                    <button
                        type="button"
                        onClick={handleToggle}
                        className={`px-6 py-2 rounded-lg font-bold border transition-colors ${
                            task.completed ? 'bg-yellow-400 text-white hover:bg-yellow-500 border-yellow-400' : 'bg-green-500 text-white hover:bg-green-600 border-green-500'
                        }`}
                    >
                        {task.completed ? 'Segna da Fare' : 'Completa'}
                    </button>
                )}
                <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-agro-green text-white font-bold hover:bg-agro-green-light transition-colors"
                >
                    Salva
                </button>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
};
