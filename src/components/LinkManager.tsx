import React, { useState } from 'react';
import { Plus, Trash2, ExternalLink, GripVertical } from 'lucide-react';
import { Link } from '@/types';

interface LinkManagerProps {
  links: Link[];
  onUpdateLinks: (links: Link[]) => Promise<void>;
  isOwner: boolean;
}

export const LinkManager: React.FC<LinkManagerProps> = ({
  links,
  onUpdateLinks,
  isOwner,
}) => {
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '' });

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) return;

    const linkToAdd: Link = {
      id: Date.now().toString(),
      title: newLink.title,
      url: newLink.url.startsWith('http') ? newLink.url : `https://${newLink.url}`,
      order: links.length,
    };

    await onUpdateLinks([...links, linkToAdd]);
    setNewLink({ title: '', url: '' });
    setIsAddingLink(false);
  };

  const handleDeleteLink = async (linkId: string) => {
    const updatedLinks = links.filter(link => link.id !== linkId);
    await onUpdateLinks(updatedLinks);
  };

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Links</h2>
        {isOwner && (
          <button
            onClick={() => setIsAddingLink(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rise-600 text-white rounded-lg hover:bg-rise-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Link
          </button>
        )}
      </div>

      {/* Add Link Form */}
      {isAddingLink && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Link Title"
              value={newLink.title}
              onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rise-500"
            />
            <input
              type="url"
              placeholder="URL (https://example.com)"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rise-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddLink}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsAddingLink(false);
                  setNewLink({ title: '', url: '' });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Links List */}
      <div className="space-y-3">
        {links.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {isOwner ? 'Add your first link!' : 'No links added yet.'}
          </p>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-rise-300 transition-colors group cursor-pointer"
              onClick={() => !isOwner && handleLinkClick(link.url)}
            >
              {isOwner && (
                <GripVertical className="w-4 h-4 text-gray-400" />
              )}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{link.title}</h3>
                <p className="text-sm text-gray-500">{link.url}</p>
              </div>
              <div className="flex items-center gap-2">
                {!isOwner && (
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-rise-600" />
                )}
                {isOwner && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLinkClick(link.url);
                      }}
                      className="p-1 text-gray-400 hover:text-rise-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLink(link.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};