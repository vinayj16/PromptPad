import React, { useState, useEffect } from 'react';
import { 
  X, Search, FileText, Briefcase, GraduationCap, 
  Mail, Calendar, Award, Users, BookOpen, 
  Presentation, Grid3X3, Star, Download, Star as StarIcon, Zap, Loader2
} from 'lucide-react';
import { templatesAPI } from '../../services/api';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  preview: string;
  isPremium?: boolean;
  tags: string[];
  rating?: { average: number };
  usageCount?: number;
}

interface TemplateGalleryProps {
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onClose, onSelectTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [apiTemplates, setApiTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Move this up before useEffect and all code that references it
  const templates: Template[] = [
    {
      id: 'blank',
      name: 'Blank Document',
      description: 'Start with a clean slate',
      category: 'basic',
      icon: FileText,
      preview: '/api/placeholder/200/250',
      tags: ['basic', 'simple']
    },
    {
      id: 'modern-resume',
      name: 'Modern Resume',
      description: 'Professional resume template with modern design',
      category: 'business',
      icon: Briefcase,
      preview: '/api/placeholder/200/250',
      tags: ['resume', 'professional', 'modern']
    },
    {
      id: 'business-letter',
      name: 'Business Letter',
      description: 'Formal business correspondence template',
      category: 'business',
      icon: Mail,
      preview: '/api/placeholder/200/250',
      tags: ['letter', 'formal', 'business']
    },
    {
      id: 'academic-paper',
      name: 'Academic Paper',
      description: 'Research paper with proper formatting',
      category: 'academic',
      icon: GraduationCap,
      preview: '/api/placeholder/200/250',
      tags: ['academic', 'research', 'paper']
    },
    {
      id: 'project-proposal',
      name: 'Project Proposal',
      description: 'Comprehensive project proposal template',
      category: 'business',
      icon: Presentation,
      preview: '/api/placeholder/200/250',
      isPremium: true,
      tags: ['proposal', 'project', 'business']
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      description: 'Eye-catching newsletter design',
      category: 'creative',
      icon: Grid3X3,
      preview: '/api/placeholder/200/250',
      tags: ['newsletter', 'marketing', 'creative']
    },
    {
      id: 'meeting-agenda',
      name: 'Meeting Agenda',
      description: 'Structured meeting agenda template',
      category: 'business',
      icon: Users,
      preview: '/api/placeholder/200/250',
      tags: ['meeting', 'agenda', 'business']
    },
    {
      id: 'thesis',
      name: 'Thesis Template',
      description: 'Complete thesis formatting template',
      category: 'academic',
      icon: BookOpen,
      preview: '/api/placeholder/200/250',
      isPremium: true,
      tags: ['thesis', 'academic', 'research']
    },
    {
      id: 'invoice',
      name: 'Professional Invoice',
      description: 'Clean and professional invoice template',
      category: 'business',
      icon: Award,
      preview: '/api/placeholder/200/250',
      tags: ['invoice', 'billing', 'business']
    },
    {
      id: 'calendar',
      name: 'Monthly Calendar',
      description: 'Printable monthly calendar template',
      category: 'personal',
      icon: Calendar,
      preview: '/api/placeholder/200/250',
      tags: ['calendar', 'planning', 'personal']
    }
  ];

  useEffect(() => {
    setLoading(true);
    templatesAPI.getAll()
      .then(res => {
        // If backend returns a single object, wrap in array
        const data = Array.isArray(res.data) ? res.data : [res.data];
        // Map backend fields to Template interface
        setApiTemplates(data.map((tpl: any) => ({
          id: tpl.id?.toString() || tpl._id?.toString() || 'unknown',
          name: tpl.title || tpl.name || 'Untitled',
          description: tpl.description || tpl.content || '',
          category: tpl.category || 'other',
          icon: FileText, // fallback icon
          preview: tpl.thumbnail || '',
          tags: tpl.tags || [],
          rating: tpl.rating || undefined,
          usageCount: tpl.usageCount || undefined,
        })));
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load templates from server.');
        setLoading(false);
      });
  }, []);

  // Use API templates if available, else fallback to local
  const templatesToShow = apiTemplates.length > 0 ? apiTemplates : templates;

  const categories = [
    { id: 'all', name: 'All Templates', count: 50 },
    { id: 'business', name: 'Business', count: 12 },
    { id: 'academic', name: 'Academic', count: 8 },
    { id: 'personal', name: 'Personal', count: 15 },
    { id: 'creative', name: 'Creative', count: 10 },
    { id: 'legal', name: 'Legal', count: 5 },
  ];

  const handleTagClick = (tag: string) => {
    setActiveTag(tag === activeTag ? null : tag);
    setSearchTerm(tag === activeTag ? '' : tag);
  };

  const highlight = (text: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-yellow-200 px-0.5 rounded">{part}</mark> : part
    );
  };

  const filteredTemplates = templatesToShow.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (template.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesTag = !activeTag || (template.tags || []).includes(activeTag);
    return matchesSearch && matchesCategory && matchesTag;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Category Pills */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-200 bg-gray-50 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-1 rounded-full font-medium transition-colors border focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
              }`}
              tabIndex={0}
            >
              {category.name} <span className="ml-1 text-xs text-gray-400">{category.count}</span>
            </button>
          ))}
        </div>
        {/* Tag Quick Filters */}
        <div className="flex items-center gap-2 px-6 py-2 border-b border-gray-100 bg-white overflow-x-auto">
          {[...new Set(templatesToShow.flatMap(t => t.tags || []))].map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-0.5 rounded-full text-xs font-medium transition-colors border focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                activeTag === tag
                  ? 'bg-blue-100 text-blue-700 border-blue-400'
                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-blue-50'
              }`}
              tabIndex={0}
            >
              #{tag}
            </button>
          ))}
        </div>
        {/* Search Bar */}
        <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setActiveTag(null); }}
            className="flex-1 bg-transparent outline-none text-gray-800"
          />
        </div>
        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-64" />
            ))
          ) : error ? (
            <div className="col-span-full flex items-center justify-center h-32 text-red-500">{error}</div>
          ) : filteredTemplates.length === 0 ? (
            <div className="col-span-full flex items-center justify-center h-32 text-gray-400">No templates found.</div>
          ) : (
            filteredTemplates.map(template => (
              <div
                key={template.id}
                className="relative bg-white rounded-lg shadow group border border-gray-100 flex flex-col cursor-pointer transition-transform duration-200 focus-within:ring-2 focus-within:ring-blue-400 hover:scale-[1.03] hover:shadow-xl hover:border-blue-200"
                tabIndex={0}
                aria-label={`Select template: ${template.name}`}
                onClick={() => setPreviewTemplate(template)}
                onKeyDown={e => { if (e.key === 'Enter') setPreviewTemplate(template); }}
              >
                {/* Premium Badge */}
                {template.isPremium && (
                  <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Zap className="w-3 h-3 inline" /> Premium
                  </span>
                )}
                {/* Preview image */}
                {template.preview ? (
                  <img src={template.preview} alt={template.name} className="w-full h-32 object-cover rounded-t-lg transition-all group-hover:opacity-90" />
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded-t-lg flex items-center justify-center text-gray-300">
                    <FileText className="w-10 h-10" />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center mb-2">
                    <template.icon className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-semibold text-gray-900 text-base flex-1">{highlight(template.name)}</span>
                  </div>
                  <div className="text-gray-600 text-sm mb-2 flex-1">{highlight(template.description)}</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {template.tags && template.tags.map(tag => (
                      <button
                        key={tag}
                        onClick={e => { e.stopPropagation(); handleTagClick(tag); }}
                        className={`bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeTag === tag ? 'ring-2 ring-blue-400' : ''}`}
                        tabIndex={0}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-auto">
                    <div className="text-xs text-gray-400">{template.category}</div>
                    {/* Rating/Usage if available */}
                    {template.rating && (
                      <span className="flex items-center gap-0.5 ml-2 text-yellow-500 text-xs">
                        <StarIcon className="w-3 h-3" /> {template.rating.average?.toFixed(1) || '5.0'}
                      </span>
                    )}
                    {template.usageCount && (
                      <span className="ml-2 text-xs text-gray-400">{template.usageCount} uses</span>
                    )}
                  </div>
                  {/* Use Template Button (appears on hover/focus) */}
                  <button
                    className="mt-3 px-4 py-1.5 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-all opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100"
                    onClick={e => { e.stopPropagation(); onSelectTemplate(template); }}
                    tabIndex={0}
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Preview Modal */}
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative flex flex-col">
              <button
                className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
                onClick={() => setPreviewTemplate(null)}
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
              {previewTemplate.preview ? (
                <img src={previewTemplate.preview} alt={previewTemplate.name} className="w-full h-48 object-cover rounded mb-4" />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center text-gray-300 mb-4">
                  <FileText className="w-10 h-10" />
                </div>
              )}
              <div className="flex items-center mb-2">
                <previewTemplate.icon className="w-5 h-5 text-blue-500 mr-2" />
                <span className="font-semibold text-gray-900 text-lg flex-1">{previewTemplate.name}</span>
                {previewTemplate.isPremium && (
                  <span className="ml-2 bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Zap className="w-3 h-3 inline" /> Premium
                  </span>
                )}
              </div>
              <div className="text-gray-600 mb-2">{previewTemplate.description}</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {previewTemplate.tags && previewTemplate.tags.map(tag => (
                  <span key={tag} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">#{tag}</span>
                ))}
              </div>
              <div className="text-xs text-gray-400 mb-4">Category: {previewTemplate.category}</div>
              <button
                className="mt-auto px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-all"
                onClick={() => { onSelectTemplate(previewTemplate); setPreviewTemplate(null); }}
              >
                Use This Template
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateGallery;