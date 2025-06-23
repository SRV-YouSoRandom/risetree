import React, { useState } from 'react';
import { Edit, Save, X, User } from 'lucide-react';
import { Profile } from '@/types';

interface ProfileCardProps {
  profile: Profile | null;
  onUpdateProfile: (data: Partial<Profile>) => Promise<void>;
  isOwner: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onUpdateProfile,
  isOwner,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || '',
  });

  const handleSave = async () => {
    try {
      await onUpdateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      display_name: profile?.display_name || '',
      username: profile?.username || '',
      bio: profile?.bio || '',
      avatar_url: profile?.avatar_url || '',
    });
    setIsEditing(false);
  };

  if (!profile && !isOwner) {
    return (
      <div className="text-center py-8">
        <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
      <div className="text-center">
        {/* Avatar */}
        <div className="relative mb-6">
          {formData.avatar_url ? (
            <img
              src={formData.avatar_url}
              alt="Avatar"
              className="w-24 h-24 rounded-full mx-auto object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Profile Info */}
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="url"
              placeholder="Avatar URL"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rise-500"
            />
            <input
              type="text"
              placeholder="Display Name"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rise-500"
            />
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rise-500"
            />
            <textarea
              placeholder="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rise-500 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {profile?.display_name || 'Anonymous User'}
            </h1>
            {profile?.username && (
              <p className="text-rise-600 mb-2">@{profile.username}</p>
            )}
            {profile?.bio && (
              <p className="text-gray-600 mb-4">{profile.bio}</p>
            )}
            {isOwner && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-rise-600 text-white rounded-lg hover:bg-rise-700 transition-colors mx-auto"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};