import React from 'react';
import { Calendar, Clock, Users, Video, Edit, UserPlus, Check, X, ExternalLink } from 'lucide-react';
import { type Meeting, type MeetingType } from '../../services/meetingService';

interface MeetingCardProps {
    meeting: Meeting;
    currentUserId: number;
    meetingType: MeetingType;
    onEdit: () => void;
    onAddParticipants: () => void;
    onAccept: () => void;
    onDecline: () => void;
    onJoin: () => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({
    meeting,
    currentUserId,
    meetingType,
    onEdit,
    onAddParticipants,
    onAccept,
    onDecline,
    onJoin,
}) => {
    const isCreator = meeting.created_by === currentUserId;
    const userParticipant = meeting.participants.find(p => p.user_id === currentUserId);
    const participantStatus = userParticipant?.status;

    const isUpcoming = () => {
        const meetingDateTime = new Date(`${meeting.date}T${meeting.time}`);
        const now = new Date();
        return meetingDateTime > now && meeting.status === 'scheduled';
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'ongoing': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getParticipantStatusColor = (status: string) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'declined': return 'bg-red-100 text-red-800';
            case 'invited': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const renderActions = () => {
        if (meetingType === 'created' && isCreator) {
            return (
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                    <button
                        onClick={onAddParticipants}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Participant
                    </button>
                </div>
            );
        }

        if (meetingType === 'invited' && participantStatus === 'invited') {
            return (
                <div className="flex gap-2">
                    <button
                        onClick={onAccept}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                    >
                        <Check className="w-4 h-4" />
                        Accept
                    </button>
                    <button
                        onClick={onDecline}
                        className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Decline
                    </button>
                </div>
            );
        }

        if (meetingType === 'my-meetings' && isUpcoming() && (participantStatus === 'accepted' || isCreator)) {
            return (
                <button
                    onClick={onJoin}
                    className="flex items-center gap-1 px-4 py-2 bg-[#14244c] hover:bg-[#1e3a5f] text-white text-sm rounded-lg transition-colors"
                >
                    <ExternalLink className="w-4 h-4" />
                    Join Meeting
                </button>
            );
        }

        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{meeting.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                        {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                    </span>
                </div>

                {meeting.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{meeting.description}</p>
                )}

                {/* Meeting Details */}
                <div className="space-y-2">
                    <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(meeting.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{formatTime(meeting.time)}</span>
                    </div>
                    {meeting.platform && (
                        <div className="flex items-center text-gray-500 text-sm">
                            <Video className="w-4 h-4 mr-2" />
                            <span>{meeting.platform}</span>
                        </div>
                    )}
                    <div className="flex items-center text-gray-500 text-sm">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{meeting.participants.length} participant{meeting.participants.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>

            {/* Participant Status (for invited meetings) */}
            {meetingType === 'invited' && participantStatus && (
                <div className="px-6 py-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Your Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getParticipantStatusColor(participantStatus)}`}>
                            {participantStatus.charAt(0).toUpperCase() + participantStatus.slice(1)}
                        </span>
                    </div>
                </div>
            )}

            {/* Meeting Type Badge */}
            {isCreator && (
                <div className="px-6 py-3 bg-blue-50">
                    <span className="text-xs font-medium text-blue-800">Created by You</span>
                </div>
            )}

            {/* Actions */}
            <div className="px-6 py-4">
                {renderActions()}
            </div>
        </div>
    );
};

export default MeetingCard;
