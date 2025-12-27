// ============================================================================
// RSVPOptions.tsx - Date/Time picker for RSVP poll type
// Location: src/components/RSVPOptions.tsx
// Shows date/time slots instead of text options for RSVP polls
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, Clock, Plus, Trash2, MapPin, 
    CalendarDays, Users, AlertCircle
} from 'lucide-react';

export interface RSVPEvent {
    id: string;
    date: string;
    time: string;
    location?: string;
}

interface RSVPOptionsProps {
    events: RSVPEvent[];
    onChange: (events: RSVPEvent[]) => void;
    maxEvents?: number;
}

const RSVPOptions: React.FC<RSVPOptionsProps> = ({ 
    events, 
    onChange, 
    maxEvents = 10 
}) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [newLocation, setNewLocation] = useState('');

    const addEvent = () => {
        if (!newDate) return;
        
        const newEvent: RSVPEvent = {
            id: Date.now().toString(),
            date: newDate,
            time: newTime || '',
            location: newLocation || undefined,
        };
        
        onChange([...events, newEvent]);
        setNewDate('');
        setNewTime('');
        setNewLocation('');
        setShowAddForm(false);
    };

    const removeEvent = (id: string) => {
        onChange(events.filter(e => e.id !== id));
    };

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const formatTime = (timeStr: string): string => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    };

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CalendarDays size={18} className="text-sky-500" />
                    <span className="font-semibold text-slate-700">Event Date(s)</span>
                </div>
                <span className="text-xs text-slate-500">
                    {events.length} of {maxEvents} slots
                </span>
            </div>

            {/* Info Box */}
            {events.length === 0 && (
                <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertCircle size={18} className="text-sky-500 mt-0.5" />
                        <div>
                            <p className="text-sm text-sky-700 font-medium">
                                Add your event date(s)
                            </p>
                            <p className="text-xs text-sky-600 mt-1">
                                Attendees will RSVP with Going, Not Going, or Maybe
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Event List */}
            <AnimatePresence>
                {events.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-3 p-4 bg-white border-2 border-slate-200 rounded-xl group hover:border-sky-300 transition"
                    >
                        <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 font-bold">
                            {index + 1}
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                                    <Calendar size={16} className="text-sky-500" />
                                    {formatDate(event.date)}
                                </div>
                                {event.time && (
                                    <div className="flex items-center gap-1.5 text-slate-600">
                                        <Clock size={14} className="text-slate-400" />
                                        {formatTime(event.time)}
                                    </div>
                                )}
                                {event.location && (
                                    <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                        <MapPin size={14} className="text-slate-400" />
                                        {event.location}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <button
                            onClick={() => removeEvent(event.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                        >
                            <Trash2 size={18} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Add Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        min={today}
                                        className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                    />
                                </div>
                                
                                {/* Time */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Time (optional)
                                    </label>
                                    <input
                                        type="time"
                                        value={newTime}
                                        onChange={(e) => setNewTime(e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                    />
                                </div>
                            </div>
                            
                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Location (optional)
                                </label>
                                <input
                                    type="text"
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    placeholder="e.g., Conference Room A, Zoom, etc."
                                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                />
                            </div>
                            
                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 py-2 border-2 border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addEvent}
                                    disabled={!newDate}
                                    className="flex-1 py-2 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Add Date
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Button */}
            {!showAddForm && events.length < maxEvents && (
                <button
                    onClick={() => setShowAddForm(true)}
                    className="w-full py-3 border-2 border-dashed border-sky-300 text-sky-600 font-medium rounded-xl hover:bg-sky-50 hover:border-sky-400 transition flex items-center justify-center gap-2"
                >
                    <Plus size={18} />
                    Add Event Date
                </button>
            )}

            {/* RSVP Options Preview */}
            {events.length > 0 && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-2 font-medium">
                        Attendees will choose:
                    </p>
                    <div className="flex gap-2">
                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                            ✅ Going
                        </span>
                        <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            ❌ Not Going
                        </span>
                        <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                            🤔 Maybe
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RSVPOptions;

// ============================================================================
// Usage in VoteGeneratorCreate:
// ============================================================================
// 
// import RSVPOptions, { RSVPEvent } from './RSVPOptions';
// 
// // Add state:
// const [rsvpEvents, setRsvpEvents] = useState<RSVPEvent[]>([]);
// 
// // In the form, when pollType === 'rsvp':
// {pollType === 'rsvp' && (
//     <RSVPOptions
//         events={rsvpEvents}
//         onChange={setRsvpEvents}
//     />
// )}
// 
// // In handleCreate, for RSVP polls:
// if (pollType === 'rsvp') {
//     pollData.rsvpEvents = rsvpEvents;
//     pollData.options = ['Going', 'Not Going', 'Maybe']; // Fixed RSVP options
// }