import React, { useState, useEffect } from 'react';
import { Search, Video, Plus } from 'lucide-react';
import { meetingService, type Meeting, type MeetingType, type MeetingStatus } from '../../services/meetingService';
import MeetingCard from './MeetingCard';
import EditMeetingModal from './EditMeetingModal';
import AddParticipantsModal from './AddParticipantsModal';
import CreateMeetingModal from './CreateMeetingModal';

const MeetingPage: React.FC = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<MeetingType>('my-meetings');
    const [selectedStatus, setSelectedStatus] = useState<MeetingStatus | 'ALL'>('ALL');

    // Modal states
    const [editMeetingId, setEditMeetingId] = useState<number | null>(null);
    const [addParticipantsMeetingId, setAddParticipantsMeetingId] = useState<number | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const currentUserId = parseInt(localStorage.getItem('id') || '0');

    const fetchMeetings = async () => {
        try {
            setLoading(true);
            setError(null);

            let meetingsData: Meeting[] = [];
            const statusFilter = selectedStatus === 'ALL' ? undefined : selectedStatus;

            switch (selectedType) {
                case 'created':
                    meetingsData = await meetingService.getCreatedMeetings(statusFilter);
                    break;
                case 'invited':
                    meetingsData = await meetingService.getInvitedMeetings(statusFilter);
                    break;
                case 'my-meetings':
                    meetingsData = await meetingService.getMyMeetings(statusFilter);
                    break;
                default:
                    meetingsData = await meetingService.getMeetings(statusFilter);
            }

            setMeetings(meetingsData);
        } catch (err) {
            console.error('Error fetching meetings:', err);
            setError('Failed to load meetings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Filter meetings based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredMeetings(meetings);
        } else {
            const filtered = meetings.filter(meeting =>
                meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                meeting.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                meeting.platform?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredMeetings(filtered);
        }
    }, [meetings, searchQuery]);

    // Fetch meetings when filters change
    useEffect(() => {
        fetchMeetings();
    }, [selectedType, selectedStatus]);

    const handleEditMeeting = (meetingId: number) => {
        setEditMeetingId(meetingId);
    };

    const handleAddParticipants = (meetingId: number) => {
        setAddParticipantsMeetingId(meetingId);
    };

    const handleMeetingUpdated = () => {
        fetchMeetings();
        setEditMeetingId(null);
        setAddParticipantsMeetingId(null);
    };

    const handleAcceptInvite = async (meetingId: number, participantId: number) => {
        try {
            await meetingService.updateParticipantStatus(meetingId, participantId, 'accepted');
            fetchMeetings();
        } catch (error) {
            console.error('Error accepting invite:', error);
            setError('Failed to accept invitation. Please try again.');
        }
    };

    const handleDeclineInvite = async (meetingId: number, participantId: number) => {
        try {
            await meetingService.updateParticipantStatus(meetingId, participantId, 'declined');
            fetchMeetings();
        } catch (error) {
            console.error('Error declining invite:', error);
            setError('Failed to decline invitation. Please try again.');
        }
    };

    const getTypeDisplayName = (type: MeetingType): string => {
        switch (type) {
            case 'created': return 'Created by Me';
            case 'invited': return 'Invited to';
            case 'my-meetings': return 'My Meetings';
            default: return 'All Meetings';
        }
    };

    const getStatusBadgeColor = (status: MeetingStatus): string => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'ongoing': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading meetings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-md">
                    <div className="text-red-600 text-lg font-medium mb-2">Error Loading Meetings</div>
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={fetchMeetings}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="bg-gradient-to-r from-[#14244c] to-[#1e3a5f] text-white py-8 px-6 rounded-xl mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">MEETINGS</h1>
                            <p className="text-blue-100 mt-2">Manage your meetings and collaborations</p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-[#ecb31d] hover:bg-[#d4a017] text-[#14244c] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Create Meeting
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search meetings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14244c] focus:border-transparent"
                            />
                        </div>

                        {/* Meeting Type Filter */}
                        <div>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value as MeetingType)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14244c] focus:border-transparent"
                            >
                                <option value="my-meetings">My Meetings</option>
                                <option value="created">Created by Me</option>
                                <option value="invited">Invited to</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value as MeetingStatus | 'ALL')}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14244c] focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Current Filter Display */}
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-gray-600 font-medium">
                        Showing: {getTypeDisplayName(selectedType)}
                    </span>
                    {selectedStatus !== 'ALL' && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(selectedStatus)}`}>
                            {selectedStatus}
                        </span>
                    )}
                    <span className="text-gray-500 text-sm">
                        ({filteredMeetings.length} meeting{filteredMeetings.length !== 1 ? 's' : ''})
                    </span>
                </div>

                {/* Meetings Grid */}
                {filteredMeetings.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-12 max-w-md mx-auto">
                            <Video className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Meetings Found</h3>
                            <p className="text-gray-600 mb-6">
                                {searchQuery ?
                                    'No meetings match your search criteria.' :
                                    `You don't have any ${getTypeDisplayName(selectedType).toLowerCase()} yet.`
                                }
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="bg-[#14244c] hover:bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Create Your First Meeting
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMeetings.map((meeting) => {
                            const userParticipant = meeting.participants.find(p => p.user_id === currentUserId);
                            return (
                                <MeetingCard
                                    key={meeting.id}
                                    meeting={meeting}
                                    currentUserId={currentUserId}
                                    meetingType={selectedType}
                                    onEdit={() => handleEditMeeting(meeting.id)}
                                    onAddParticipants={() => handleAddParticipants(meeting.id)}
                                    onAccept={() => userParticipant && handleAcceptInvite(meeting.id, userParticipant.id)}
                                    onDecline={() => userParticipant && handleDeclineInvite(meeting.id, userParticipant.id)}
                                    onJoin={() => window.open(meeting.link, '_blank')}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Modals */}
                <EditMeetingModal
                    isOpen={editMeetingId !== null}
                    meetingId={editMeetingId}
                    onClose={() => setEditMeetingId(null)}
                    onSuccess={handleMeetingUpdated}
                />

                <AddParticipantsModal
                    isOpen={addParticipantsMeetingId !== null}
                    meetingId={addParticipantsMeetingId}
                    onClose={() => setAddParticipantsMeetingId(null)}
                    onSuccess={handleMeetingUpdated}
                />

                <CreateMeetingModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleMeetingUpdated}
                />
            </div>
        </div>
    );
};

export default MeetingPage;
