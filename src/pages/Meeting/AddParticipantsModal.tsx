import React, { useState, useEffect } from 'react';
import { meetingService, type Meeting, type User } from '../../services/meetingService';
import { AlertCircle, UserPlus, X, Search, Check, Trash2, Users } from 'lucide-react';

interface AddParticipantsModalProps {
    isOpen: boolean;
    meetingId: number | null;
    onClose: () => void;
    onSuccess: (updatedMeeting: Meeting) => void;
}

const AddParticipantsModal: React.FC<AddParticipantsModalProps> = ({
    isOpen,
    meetingId,
    onClose,
    onSuccess
}) => {
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && meetingId) {
            fetchData();
        }
    }, [isOpen, meetingId]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(allUsers.filter(user =>
                !meeting?.participants.some(p => p.user_id === user.id)
            ));
        } else {
            setFilteredUsers(
                allUsers.filter(user => {
                    const matchesSearch =
                        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchQuery.toLowerCase());
                    const notInMeeting = !meeting?.participants.some(p => p.user_id === user.id);
                    return matchesSearch && notInMeeting;
                })
            );
        }
    }, [searchQuery, allUsers, meeting]);

    const fetchData = async () => {
        if (!meetingId) return;

        try {
            setIsLoading(true);
            setError('');
            const [meetingData, usersData] = await Promise.all([
                meetingService.getMeeting(meetingId),
                meetingService.getUsers()
            ]);
            setMeeting(meetingData);
            setAllUsers(usersData);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load participants and users. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserSelect = (userId: number) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUsers(newSelected);
    };

    const handleAddParticipants = async () => {
        if (!meetingId || selectedUsers.size === 0) return;

        setIsSubmitting(true);
        setError('');

        try {
            const promises = Array.from(selectedUsers).map(userId =>
                meetingService.addParticipant(meetingId, {
                    user_id: userId,
                    status: 'invited'
                })
            );

            await Promise.all(promises);

            // Refresh meeting data
            const updatedMeeting = await meetingService.getMeeting(meetingId);
            onSuccess(updatedMeeting);
            handleClose();
        } catch (err) {
            console.error('Error adding participants:', err);
            setError('Failed to add participants. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveParticipant = async (participantId: number) => {
        if (!meetingId) return;

        try {
            await meetingService.removeParticipant(meetingId, participantId);

            // Refresh meeting data
            const updatedMeeting = await meetingService.getMeeting(meetingId);
            setMeeting(updatedMeeting);
            onSuccess(updatedMeeting);
        } catch (err) {
            console.error('Error removing participant:', err);
            setError('Failed to remove participant. Please try again.');
        }
    };

    const handleClose = () => {
        setMeeting(null);
        setAllUsers([]);
        setFilteredUsers([]);
        setSearchQuery('');
        setSelectedUsers(new Set());
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Manage Participants</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Loading participants and users...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Current Participants */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Users size={20} />
                                    Current Participants ({meeting?.participants.length || 0})
                                </h3>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {meeting?.participants.map((participant) => (
                                        <div
                                            key={participant.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">
                                                    {participant.user?.username || 'Unknown User'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {participant.user?.email}
                                                </div>
                                                <div className="text-xs">
                                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${participant.status === 'accepted'
                                                            ? 'bg-green-100 text-green-800'
                                                            : participant.status === 'declined'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {participant.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveParticipant(participant.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Remove participant"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {(!meeting?.participants || meeting.participants.length === 0) && (
                                        <div className="text-center py-8 text-gray-500">
                                            No participants yet
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Add New Participants */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <UserPlus size={20} />
                                    Add Participants
                                </h3>

                                {/* Search */}
                                <div className="relative mb-4">
                                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search users by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Available Users */}
                                <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                                    {filteredUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.has(user.id)}
                                                onChange={() => handleUserSelect(user.id)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{user.username}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                                {user.role && (
                                                    <div className="text-xs text-gray-400">{user.role}</div>
                                                )}
                                            </div>
                                            {selectedUsers.has(user.id) && (
                                                <Check size={16} className="text-blue-600" />
                                            )}
                                        </div>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            {searchQuery ? 'No users found matching your search' : 'All users are already participants'}
                                        </div>
                                    )}
                                </div>

                                {/* Add Button */}
                                {selectedUsers.size > 0 && (
                                    <button
                                        onClick={handleAddParticipants}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus size={16} />
                                                Add {selectedUsers.size} Participant{selectedUsers.size !== 1 ? 's' : ''}
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                        <button
                            onClick={handleClose}
                            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddParticipantsModal;
