import React, { useState } from 'react';
import { 
  X, Search, FileText, Briefcase, GraduationCap, 
  Mail, Calendar, Award, Users, BookOpen, 
  Presentation, Grid3X3, Star, Download
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  preview: string;
  isPremium?: boolean;
  tags: string[];
}

interface TemplateGalleryProps {
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onClose, onSelectTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Templates', count: 50 },
    { id: 'business', name: 'Business', count: 12 },
    { id: 'academic', name: 'Academic', count: 8 },
    { id: 'personal', name: 'Personal', count: 15 },
    { id: 'creative', name: 'Creative', count: 10 },
    { id: 'legal', name: 'Legal', count: 5 },
  ];

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

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Templates</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <span className="text-xs text-gray-500">{category.count}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Premium Templates</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Access 100+ premium templates with advanced features
            </p>
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs py-2 rounded-md hover:from-blue-700 hover:to-purple-700">
              Upgrade Now
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span>Import Template</span>
              </button>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className="group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
                  onClick={() => onSelectTemplate(template)}
                >
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <template.icon className="w-12 h-12 text-gray-400" />
                    </div>
                    {template.isPremium && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        Premium
                      </div>
                    )}
                    <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                      <button className="bg-white text-blue-600 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                        Use Template
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-600">Try adjusting your search or browse different categories</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;