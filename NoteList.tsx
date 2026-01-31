import { useState } from 'react';
import { Plus, Tag } from 'lucide-react';
import { Note } from '../types';

interface NoteListProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id'>) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  selectedDate: Date;
}

export const NoteList = ({ 
  notes, 
  onAddNote, 
  onUpdateNote, 
  onDeleteNote,
  selectedDate 
}: NoteListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [newNote, setNewNote] = useState({ content: '', tags: '' });

  const filteredNotes = notes.filter(note => 
    new Date(note.date).toDateString() === selectedDate.toDateString()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.content.trim()) {
      onAddNote({
        content: newNote.content,
        date: selectedDate.toISOString().split('T')[0],
        tags: newNote.tags ? newNote.tags.split(',').map(tag => tag.trim()) : [],
      });
      setNewNote({ content: '', tags: '' });
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Notes for {selectedDate.toLocaleDateString()}</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
          <textarea
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            placeholder="Add a note..."
            className="w-full p-2 border border-gray-300 rounded mb-2"
            rows={3}
          />
          <div className="flex items-center mb-2">
            <Tag size={16} className="mr-2 text-gray-500" />
            <input
              value={newNote.tags}
              onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
              placeholder="Tags (comma separated)"
              className="flex-1 p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Add Note
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="mb-2">{note.content}</p>
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => onUpdateNote(note.id, { content: prompt('Edit note:', note.content) || undefined })}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteNote(note.id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {filteredNotes.length === 0 && !showForm && (
          <p className="text-gray-500 italic">No notes for this date. Click + to add one.</p>
        )}
      </div>
    </div>
  );
};