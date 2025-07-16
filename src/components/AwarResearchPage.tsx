import React, { useState, useMemo, type JSX } from "react";
import { motion } from "framer-motion";
import { 
  Award, 
  BookOpen, 
  Building, 
  Calendar, 
  Filter, 
  Search, 
  X, 
  Users, 
  GraduationCap,
  Trophy,
  DollarSign,
} from "lucide-react";

// Dummy data
const awardsData = [
  {
    id: 1,
    title: "Excellence in Teaching Award",
    recipient: "Dr. Sarah Mitchell",
    type: "Faculty Award",
    category: "Teaching",
    amount: "$5,000",
    date: "2024",
    institution: "University of Excellence",
    description: "Recognized for outstanding innovation in curriculum development and student engagement in advanced mathematics courses.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    title: "National Science Foundation Graduate Research Fellowship",
    recipient: "Jennifer Chen",
    type: "Student Fellowship",
    category: "Research",
    amount: "$138,000",
    date: "2024",
    institution: "NSF",
    description: "Three-year fellowship supporting graduate research in quantum computing and machine learning applications.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Research Grant: AI in Healthcare",
    recipient: "Prof. David Kim",
    type: "Research Grant",
    category: "Healthcare",
    amount: "$750,000",
    date: "2024",
    institution: "NIH",
    description: "Multi-year grant to develop AI-powered diagnostic tools for early detection of neurodegenerative diseases.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    title: "Outstanding Student Research Award",
    recipient: "Michael Rodriguez",
    type: "Student Award",
    category: "Research",
    amount: "$2,500",
    date: "2024",
    institution: "IEEE",
    description: "Awarded for groundbreaking research in renewable energy systems and smart grid technology.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    title: "Distinguished Faculty Fellowship",
    recipient: "Dr. Emily Johnson",
    type: "Faculty Fellowship",
    category: "Research",
    amount: "$100,000",
    date: "2023",
    institution: "Guggenheim Foundation",
    description: "Fellowship to support research in computational linguistics and natural language processing.",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    title: "Innovation in Engineering Award",
    recipient: "Prof. Robert Taylor",
    type: "Faculty Award",
    category: "Innovation",
    amount: "$10,000",
    date: "2023",
    institution: "American Society of Engineers",
    description: "Recognition for developing sustainable materials for construction industry applications.",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=300&fit=crop"
  },
  {
    id: 7,
    title: "Fulbright Scholar Program",
    recipient: "Dr. Maria Santos",
    type: "Faculty Fellowship",
    category: "International",
    amount: "$45,000",
    date: "2023",
    institution: "U.S. Department of State",
    description: "Teaching and research fellowship in environmental science at Universidad de Barcelona.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop"
  },
  {
    id: 8,
    title: "Dean's List Academic Excellence",
    recipient: "Lisa Park",
    type: "Student Award",
    category: "Academic",
    amount: "$1,500",
    date: "2023",
    institution: "University of Excellence",
    description: "Consecutive semesters of outstanding academic performance with GPA above 3.8.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
  }
];

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  icon: React.ComponentType<{ size?: number }>;
}

const FilterDropdown = ({ label, options, value, onChange, icon: Icon }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white hover:bg-gray-50 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 transition-colors"
      >
        <Icon size={16} />
        {value || label}
      </button>
      {isOpen && (
        <div className="right-0 z-10 absolute bg-white shadow-lg mt-1 border border-gray-200 rounded-lg w-48">
          <div className="p-1">
            <button
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="hover:bg-gray-100 px-3 py-2 rounded w-full text-gray-700 text-sm text-left"
            >
              All {label}s
            </button>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="hover:bg-gray-100 px-3 py-2 rounded w-full text-gray-700 text-sm text-left"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

type AwardType = {
  id: number;
  title: string;
  recipient: string;
  type: string;
  category: string;
  amount: string;
  date: string;
  institution: string;
  description: string;
  image: string;
};

interface AwardCardProps {
  award: AwardType;
  index: number;
}

const AwardCard = ({ award, index }: AwardCardProps) => {
interface TypeIconProps {
    type: string;
}

const getTypeIcon = (type: TypeIconProps["type"]): JSX.Element => {
    switch (type) {
        case 'Faculty Award':
            return <Award className="text-blue-600" size={20} />;
        case 'Student Award':
            return <Trophy className="text-green-600" size={20} />;
        case 'Research Grant':
            return <DollarSign className="text-purple-600" size={20} />;
        case 'Faculty Fellowship':
            return <BookOpen className="text-orange-600" size={20} />;
        case 'Student Fellowship':
            return <GraduationCap className="text-indigo-600" size={20} />;
        default:
            return <Award className="text-gray-600" size={20} />;
    }
};

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Faculty Award':
        return 'bg-blue-100 text-blue-800';
      case 'Student Award':
        return 'bg-green-100 text-green-800';
      case 'Research Grant':
        return 'bg-purple-100 text-purple-800';
      case 'Faculty Fellowship':
        return 'bg-orange-100 text-orange-800';
      case 'Student Fellowship':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white hover:shadow-lg border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={award.image}
          alt={award.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="top-4 right-4 absolute">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(award.type)}`}>
            {award.type}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            {getTypeIcon(award.type)}
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{award.title}</h3>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-gray-400" />
          <span className="text-gray-700 text-sm">{award.recipient}</span>
        </div>
        
        <div className="flex items-center gap-4 mb-3 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <Building size={14} />
            <span>{award.institution}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{award.date}</span>
          </div>
        </div>
        
        <p className="mb-4 text-gray-600 text-sm line-clamp-3">{award.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <DollarSign size={16} className="text-green-600" />
            <span className="font-semibold text-green-600">{award.amount}</span>
          </div>
          <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 text-xs">
            {award.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const AwardsResearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    year: '',
    institution: '',
    category: ''
  });

  // Filter options
  const filterOptions = useMemo(() => {
    const types = [...new Set(awardsData.map(a => a.type))];
    const years = [...new Set(awardsData.map(a => a.date))].sort().reverse();
    const institutions = [...new Set(awardsData.map(a => a.institution))];
    const categories = [...new Set(awardsData.map(a => a.category))];

    return { types, years, institutions, categories };
  }, []);

  // Filtered awards
  const filteredAwards = useMemo(() => {
    return awardsData.filter(item => {
      const matchesSearch = !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = !filters.type || item.type === filters.type;
      const matchesYear = !filters.year || item.date === filters.year;
      const matchesInstitution = !filters.institution || item.institution === filters.institution;
      const matchesCategory = !filters.category || item.category === filters.category;

      return matchesSearch && matchesType && matchesYear && matchesInstitution && matchesCategory;
    });
  }, [searchQuery, filters]);

  // Clear filters
  const clearFilters = () => {
    setFilters({
      type: '',
      year: '',
      institution: '',
      category: ''
    });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(filters).some(v => v) || searchQuery;

  // Group awards by type
  const groupedAwards = useMemo(() => {
    const groups = {
      'Faculty Awards': filteredAwards.filter(a => a.type === 'Faculty Award'),
      'Student Awards': filteredAwards.filter(a => a.type === 'Student Award'),
      'Research Grants': filteredAwards.filter(a => a.type === 'Research Grant'),
      'Faculty Fellowships': filteredAwards.filter(a => a.type === 'Faculty Fellowship'),
      'Student Fellowships': filteredAwards.filter(a => a.type === 'Student Fellowship')
    };
    return groups;
  }, [filteredAwards]);

  // Statistics
  const stats = useMemo(() => {
    const totalAmount = filteredAwards.reduce((sum, award) => {
      const amount = parseFloat(award.amount.replace(/[$,]/g, ''));
      return sum + amount;
    }, 0);

    return {
      totalAwards: filteredAwards.length,
      totalAmount: totalAmount.toLocaleString(),
      facultyAwards: filteredAwards.filter(a => a.type.includes('Faculty')).length,
      studentAwards: filteredAwards.filter(a => a.type.includes('Student')).length
    };
  }, [filteredAwards]);

  return (
    <div className="mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="mb-2 font-bold text-gray-900 text-3xl">Awards, Grants & Fellowships</h1>
            <p className="text-gray-600">Celebrating excellence in research, teaching, and academic achievement.</p>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8"
      >
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Trophy className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-2xl">{stats.totalAwards}</p>
              <p className="text-gray-600 text-sm">Total Awards</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-2xl">${stats.totalAmount}</p>
              <p className="text-gray-600 text-sm">Total Value</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-2xl">{stats.facultyAwards}</p>
              <p className="text-gray-600 text-sm">Faculty Recognitions</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <GraduationCap className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-2xl">{stats.studentAwards}</p>
              <p className="text-gray-600 text-sm">Student Achievements</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex lg:flex-row flex-col gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2 transform" size={20} />
            <input
              type="text"
              placeholder="Search awards, grants, and fellowships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-2 pr-4 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterDropdown
              label="Type"
              options={filterOptions.types}
              value={filters.type}
              onChange={(value: string) => setFilters(prev => ({ ...prev, type: value }))}
              icon={Filter}
            />
            <FilterDropdown
              label="Year"
              options={filterOptions.years}
              value={filters.year}
              onChange={(value: string) => setFilters(prev => ({ ...prev, year: value }))}
              icon={Calendar}
            />
            <FilterDropdown
              label="Institution"
              options={filterOptions.institutions}
              value={filters.institution}
              onChange={(value: string) => setFilters(prev => ({ ...prev, institution: value }))}
              icon={Building}
            />
            <FilterDropdown
              label="Category"
              options={filterOptions.categories}
              value={filters.category}
              onChange={(value: string) => setFilters(prev => ({ ...prev, category: value }))}
              icon={BookOpen}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Active filters:</span>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 text-sm transition-colors"
            >
              <X size={14} />
              Clear all
            </button>
          </div>
        )}
      </motion.div>

      {/* Awards Categories */}
      <div className="space-y-12">
        {Object.entries(groupedAwards).map(([category, items]) => (
          items.length > 0 && (
            <motion.section
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="mb-6 font-bold text-gray-900 text-2xl">{category}</h2>
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item, index) => (
                  <AwardCard
                    key={item.id}
                    award={item}
                    index={index}
                  />
                ))}
              </div>
            </motion.section>
          )
        ))}
      </div>

      {/* No results */}
      {filteredAwards.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center"
        >
          <Trophy className="mx-auto mb-4 text-gray-300" size={48} />
          <p className="text-gray-500 text-lg">No awards found matching your criteria.</p>
        </motion.div>
      )}
    </div>
  );
};

export default AwardsResearchPage;