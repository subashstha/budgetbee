import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdEdit, MdCamera, MdLock, MdPerson, MdEmail } from 'react-icons/md';
import { GiBee as FaBee } from 'react-icons/gi';
import toast from 'react-hot-toast';
import { updateProfile, updateUserLocal } from '../redux/slices/authSlice';
import api from '../services/api';
import { CURRENCIES } from '../utils/formatters';
import useDate from '../hooks/useDate';
import CustomSelect from '../components/common/CustomSelect';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { format: formatDate } = useDate();

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', currency: user?.currency || 'NPR' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const fileRef = useRef();

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await dispatch(updateProfile(profileForm)).unwrap();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return toast.error('Passwords do not match');
    setSavingPassword(true);
    try {
      await api.put('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password updated!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(updateUserLocal({ avatar: res.data.avatar }));
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error('Failed to upload avatar');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      {/* Profile Header */}
      <div className="card p-6 text-center">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold overflow-hidden mx-auto border-4 border-white dark:border-gray-700 shadow-lg">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-600 transition-colors"
          >
            <MdCamera className="text-sm" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </div>
        <h2 className="font-serif text-xl font-bold text-gray-800 dark:text-gray-100">{user?.name}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
        <p className="text-xs text-gray-400 mt-1">Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>

        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="w-6 h-6 bg-gradient-primary rounded-lg flex items-center justify-center">
            <FaBee className="text-white text-xs" />
          </div>
          <span className="text-xs font-semibold text-primary-500">BudgetBee Member</span>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="card p-6">
        <h3 className="font-serif font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
          <MdPerson className="text-primary-500" /> Profile Information
        </h3>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
            <div className="relative">
              <MdPerson className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="input-field pl-10"
                placeholder="Your full name"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
            <div className="relative">
              <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input type="email" value={user?.email || ''} className="input-field pl-10 opacity-60" disabled />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Default Currency</label>
            <CustomSelect
              value={profileForm.currency}
              onChange={(val) => setProfileForm({ ...profileForm, currency: val })}
              options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.symbol} ${c.name} (${c.code})` }))}
            />
          </div>
          <button type="submit" disabled={savingProfile} className="btn-primary flex items-center gap-2">
            {savingProfile ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <><MdEdit /> Save Changes</>
            )}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <h3 className="font-serif font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
          <MdLock className="text-primary-500" /> Change Password
        </h3>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          {[
            { label: 'Current Password', key: 'currentPassword' },
            { label: 'New Password', key: 'newPassword' },
            { label: 'Confirm New Password', key: 'confirmPassword' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
              <div className="relative">
                <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="password"
                  value={passwordForm[key]}
                  onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          ))}
          <button type="submit" disabled={savingPassword} className="btn-primary flex items-center gap-2">
            {savingPassword ? 'Updating...' : <><MdLock /> Update Password</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
