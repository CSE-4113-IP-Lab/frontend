import { motion } from "framer-motion";
import { BookOpen, Building, Calendar, ExternalLink, Trash2, User } from "lucide-react";
import { useState } from "react";


type Research = {
  id: string | number;
  type: string;
  date: string;
  title: string;
  description: string;
  institution: string;
  journal: string;
  link?: string;
  supervisor: {
    username: string;
  };
};

type ResearchCardProps = {
  research: Research;
  index: number;
  isAdmin: boolean;
  onDelete: (id: string | number) => Promise<void>;
};

export const ResearchCard = ({ research, index, isAdmin, onDelete }: ResearchCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'grant':
        return 'bg-green-100 text-green-800';
      case 'fellowship':
        return 'bg-blue-100 text-blue-800';
      case 'publication':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(research.id);
    setIsDeleting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow relative group"
    >
      {isAdmin && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(research.type)}`}>
            {research.type}
          </span>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar size={14} />
            {research.date}
          </span>
        </div>
        {research.link && (
          <a
            href={research.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <ExternalLink size={16} />
          </a>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
        {research.title}
      </h3>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {research.description}
      </p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building size={14} />
          <span>{research.institution}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen size={14} />
          <span>{research.journal}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User size={14} />
          <span>{research.supervisor.username}</span>
        </div>
      </div>
    </motion.div>
  );
};