import React, { useEffect, useState } from 'react';
import deliveryApi from '../../api/deliveryApi';
import { User, Phone, MapPin, Truck, CheckCircle, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const DeliveryProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await deliveryApi.getProfile();
      setProfile(response.data.data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const toggleOnlineStatus = async () => {
    setIsUpdatingStatus(true);
    try {
      const newStatus = !profile.isOnline;
      await deliveryApi.updateOnlineStatus({ isOnline: newStatus });
      setProfile({ ...profile, isOnline: newStatus });
      toast.success(newStatus ? 'You are now online' : 'You are now offline');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) return <div className="animate-pulse">Loading profile...</div>;
  if (!profile) return null;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <h1 className="page-title">My Profile</h1>

      <div className="card p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex flex-col items-center gap-4">
            <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User size={64} className="text-gray-400" />
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${profile.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              <span className="text-sm font-medium text-gray-700">{profile.isOnline ? 'Online' : 'Offline'}</span>
            </div>
            
            <button 
              onClick={toggleOnlineStatus}
              disabled={isUpdatingStatus}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors w-full ${
                profile.isOnline 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isUpdatingStatus ? 'Updating...' : (profile.isOnline ? 'Go Offline' : 'Go Online')}
            </button>
          </div>

          <div className="flex-1 space-y-6 w-full">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.userId?.name || 'Delivery Partner'}</h2>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Phone size={16} />
                <span>{profile.userId?.mobile || 'No mobile provided'}</span>
              </div>
              {profile.city && (
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <MapPin size={16} />
                  <span>{profile.city.name || 'Unknown City'}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Truck size={18} />
                  <span className="text-sm font-medium">Vehicle Info</span>
                </div>
                <p className="font-semibold text-gray-900 capitalize">{profile.vehicleType || 'Not specified'}</p>
                <p className="text-sm text-gray-600 uppercase">{profile.vehicleNumber || 'No number'}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <User size={18} />
                  <span className="text-sm font-medium">Account Status</span>
                </div>
                <div className="mt-1">
                  <span className={`badge ${
                    profile.status === 'active' ? 'badge-success' : 
                    profile.status === 'pending' ? 'badge-warning' : 'badge-error'
                  }`}>
                    {profile.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 text-blue-900 rounded-lg p-4 text-center">
                  <Package className="mx-auto h-8 w-8 text-blue-500 mb-2" />
                  <div className="text-2xl font-bold">{profile.activeOrders?.length || 0}</div>
                  <div className="text-sm text-blue-700 font-medium">Current Orders</div>
                </div>
                <div className="bg-green-50 text-green-900 rounded-lg p-4 text-center">
                  <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                  <div className="text-2xl font-bold">{profile.totalDeliveries || 0}</div>
                  <div className="text-sm text-green-700 font-medium">Total Deliveries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryProfile;
