import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { FilterDropdown } from "@/components/FilterDropdown";
import { ResearchCard } from "@/components/ResearchCar";
import { motion } from "framer-motion";
import { BookOpen, Building, Calendar, Filter, Plus, Search, X } from "lucide-react";
import { researchService, type ResearchContribution } from "./ResearchService";
import { useEffect, useMemo, useState } from "react";
import { AddResearchModal } from "@/components/AddResearchModal";

const ResearchGallery = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "faculty" || role === "admin");
  }, []);
  const [research, setResearch] = useState<ResearchContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    year: '',
    institution: '',
    journal: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    research: ResearchContribution | null;
  }>({
    isOpen: false,
    research: null
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch research data
  useEffect(() => {
    const fetchResearch = async () => {
      try {
        setLoading(true);
        const data = await researchService.getResearchContributions();
        console.log('Fetched research data:', data);
        // Optional: Validate data structure matches your interface
        if (Array.isArray(data) && data.every(item =>
          'id' in item &&
          'title' in item &&
          'supervisor' in item &&
          'user' in item
        )) {
          setResearch(data);
        } else {
          console.error('Data format mismatch:', data);
        }
      } catch (error) {
        console.error('Error fetching research:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResearch();
  }, []);

  // Filter options
  const filterOptions = useMemo(() => {
    const types = [...new Set(research.map(r => r.type))];
    const years = [...new Set(research.map(r => r.date))].sort().reverse();
    const institutions = [...new Set(research.map(r => r.institution))];
    const journals = [...new Set(research.map(r => r.journal))];

    return { types, years, institutions, journals };
  }, [research]);

  // Filtered research
  const filteredResearch = useMemo(() => {
    return research.filter(item => {
      const matchesSearch = !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supervisor.username.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = !filters.type || item.type === filters.type;
      const matchesYear = !filters.year || item.date === filters.year;
      const matchesInstitution = !filters.institution || item.institution === filters.institution;
      const matchesJournal = !filters.journal || item.journal === filters.journal;

      return matchesSearch && matchesType && matchesYear && matchesInstitution && matchesJournal;
    });
  }, [research, searchQuery, filters]);

  // Clear filters
  const clearFilters = () => {
    setFilters({
      type: '',
      year: '',
      institution: '',
      journal: ''
    });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(filters).some(v => v) || searchQuery;

  // Group research by type
  const groupedResearch = useMemo(() => {
    const groups = {
      Grants: filteredResearch.filter(r => r.type === 'Grant'),
      Fellowships: filteredResearch.filter(r => r.type === 'Fellowship'),
      Publications: filteredResearch.filter(r => r.type === 'Publication')
    };
    return groups;
  }, [filteredResearch]);

  // Handle research creation
  const handleResearchCreated = (newResearch: ResearchContribution) => {
    setResearch(prev => [newResearch, ...prev]);
  };

  // Handle research deletion
  const handleDeleteResearch = async (id: number) => {
    try {
      setIsDeleting(true);
      await researchService.deleteResearch(id);
      setResearch(prev => prev.filter(r => r.id !== id));
      setDeleteModal({ isOpen: false, research: null });
    } catch (error) {
      console.error('Error deleting research:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="border-b-2 border-blue-600 rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

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
            <h1 className="mb-2 font-bold text-gray-900 text-3xl">Research Gallery</h1>
            <p className="text-gray-600">Explore our department's research grants, fellowships, and publications.</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
            >
              <Plus size={16} />
              Add Research
            </button>
          )}
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex lg:flex-row flex-col gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2 transform" size={20} />
            <input
              type="text"
              placeholder="Search research..."
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
              onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
              icon={Filter}
            />
            <FilterDropdown
              label="Year"
              options={filterOptions.years}
              value={filters.year}
              onChange={(value) => setFilters(prev => ({ ...prev, year: value }))}
              icon={Calendar}
            />
            <FilterDropdown
              label="Institution"
              options={filterOptions.institutions}
              value={filters.institution}
              onChange={(value) => setFilters(prev => ({ ...prev, institution: value }))}
              icon={Building}
            />
            <FilterDropdown
              label="Journal"
              options={filterOptions.journals}
              value={filters.journal}
              onChange={(value) => setFilters(prev => ({ ...prev, journal: value }))}
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

      {/* Research Categories */}
      <div className="space-y-12">
        {Object.entries(groupedResearch).map(([category, items]) => (
          items.length > 0 && (
            <motion.section
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="mb-6 font-bold text-gray-900 text-2xl">{category}</h2>
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item, index) => (
                  <ResearchCard
                    key={item.id}
                    research={item}
                    index={index}
                    isAdmin={isAdmin}
                    onDelete={async () => setDeleteModal({ isOpen: true, research: item })}
                  />
                ))}
              </div>
            </motion.section>
          )
        ))}
      </div>

      {/* No results */}
      {filteredResearch.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center"
        >
          <p className="text-gray-500 text-lg">No research found matching your criteria.</p>
        </motion.div>
      )}

      {/* Add Research Modal */}
      <AddResearchModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleResearchCreated}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, research: null })}
        onConfirm={() => deleteModal.research && handleDeleteResearch(deleteModal.research.id)}
        researchTitle={deleteModal.research?.title || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ResearchGallery;
