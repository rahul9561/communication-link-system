/** @format */

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; // Assuming Sidebar is imported
import { getUserProfile, updateUserProfile, updateUserRole, changePassword, getUserNotifications, toggleNotification, toggleTwoFactorAuth, getUserSessions, signOutSession, signOutAllSessions, getSystemPreferences, updateSystemPreference } from "../services/api"; // Import API functions
import {toast} from 'react-hot-toast'

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  });
  const [notifications, setNotifications] = useState({});
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [systemPrefs, setSystemPrefs] = useState({
    theme: "light",
    language: "English",
    dataRetention: "30 days",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [roleSelect, setRoleSelect] = useState("");

  // Fetch initial data on mount
  useEffect(() => {
    fetchUserData();
    fetchNotifications();
    fetchTwoFaStatus();
    fetchSessions();
    fetchSystemPrefs();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      if (response.success) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await getUserNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchTwoFaStatus = async () => {
    // Assuming 2FA status is part of profile or separate; here fetching from profile if added, but for now simulate fetch
    // To integrate properly, add two_fa_enabled to getUserProfile response
    try {
      const response = await getUserProfile();
      if (response.success && response.data.twoFaEnabled !== undefined) {
        setTwoFaEnabled(response.data.twoFaEnabled);
      }
    } catch (error) {
      console.error("Error fetching 2FA status:", error);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await getUserSessions();
      if (response.success) {
        setSessions(response.data);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const fetchSystemPrefs = async () => {
    try {
      const response = await getSystemPreferences();
      if (response.success) {
        setSystemPrefs(response.data);
      }
    } catch (error) {
      console.error("Error fetching system prefs:", error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await updateUserProfile(userData);
      if (response.success) {
        toast.success("Profile updated successfully!");
        // Refetch to ensure consistency
        fetchUserData();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (e) => {
    e.preventDefault();
    if (!roleSelect) return;
    try {
      setLoading(true);
      const response = await updateUserRole({ role: roleSelect });
      if (response.success) {
        toast.success("Role updated successfully!");
        setUserData({ ...userData, role: roleSelect });
        setRoleSelect("");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast("Passwords do not match!");
      return;
    }
    try {
      setLoading(true);
      const response = await changePassword(passwordData);
      if (response.success) {
        toast("Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast("Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = async (key, e) => {
    const enabled = e.target.checked;
    try {
      await toggleNotification(key, enabled);
      setNotifications({ ...notifications, [key]: enabled });
    } catch (error) {
      console.error("Error toggling notification:", error);
      // Revert checkbox if failed
      e.target.checked = !enabled;
    }
  };

  const handleTwoFaToggle = async (e) => {
    const enabled = e.target.checked;
    try {
      await toggleTwoFactorAuth(enabled);
      setTwoFaEnabled(enabled);
    } catch (error) {
      console.error("Error toggling 2FA:", error);
      e.target.checked = !enabled;
    }
  };

  const handleSignOutSession = async (device) => {
    try {
      await signOutSession(device);
      setSessions(sessions.filter(s => s.device !== device));
    } catch (error) {
      console.error("Error signing out session:", error);
    }
  };

  const handleSignOutAll = async () => {
    try {
      await signOutAllSessions();
      setSessions([]);
    } catch (error) {
      console.error("Error signing out all sessions:", error);
    }
  };

  const handleSystemUpdate = async (key, value) => {
    try {
      await updateSystemPreference(key, value);
      setSystemPrefs({ ...systemPrefs, [key]: value });
    } catch (error) {
      console.error("Error updating system preference:", error);
    }
  };

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      id: "account",
      label: "Account",
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    },
    {
      id: "security",
      label: "Security",
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    },
    {
      id: "system",
      label: "System",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    },
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={userData.firstName}
              onChange={(e) =>
                setUserData({ ...userData, firstName: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={userData.lastName}
              onChange={(e) =>
                setUserData({ ...userData, lastName: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={userData.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
      <div className="bg-gray-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Role & Permissions
        </h3>
        <p className="text-gray-600">
          Current Role:{" "}
          <span className="font-medium text-blue-600">{userData.role}</span>
        </p>
        <form onSubmit={handleRoleChange} className="mt-4 flex items-center space-x-2">
          <select
            value={roleSelect}
            onChange={(e) => setRoleSelect(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md"
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          <button
            type="submit"
            disabled={loading || !roleSelect}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            {loading ? "Updating..." : "Change Role"}
          </button>
        </form>
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Password Change
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmNewPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
      <div className="bg-gray-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Linked Accounts
        </h3>
        <ul className="space-y-2">
          <li className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-gray-900">Google Workspace</span>
            <button className="text-blue-600 hover:text-blue-900 text-sm">
              Disconnect
            </button>
          </li>
          <li className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-gray-900">Microsoft Azure</span>
            <button className="text-green-600 hover:text-green-900 text-sm">
              Connect
            </button>
          </li>
        </ul>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Email Notifications
        </h3>
        <ul className="space-y-4">
          <li className="flex items-center justify-between">
            <span className="text-gray-900">Link Status Alerts</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="linkAlerts"
                className="sr-only peer"
                checked={notifications.linkAlerts || false}
                onChange={(e) => handleNotificationToggle("linkAlerts", e)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-gray-900">Maintenance Reminders</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="maintenanceReminders"
                className="sr-only peer"
                checked={notifications.maintenanceReminders || false}
                onChange={(e) => handleNotificationToggle("maintenanceReminders", e)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-gray-900">Weekly Reports</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="weeklyReports"
                className="sr-only peer"
                checked={notifications.weeklyReports || false}
                onChange={(e) => handleNotificationToggle("weeklyReports", e)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>
        </ul>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          In-App Notifications
        </h3>
        <ul className="space-y-4">
          <li className="flex items-center justify-between">
            <span className="text-gray-900">Real-time Link Updates</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="realtimeUpdates"
                className="sr-only peer"
                checked={notifications.realtimeUpdates || false}
                onChange={(e) => handleNotificationToggle("realtimeUpdates", e)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-gray-900">System Alerts</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="systemAlerts"
                className="sr-only peer"
                checked={notifications.systemAlerts || false}
                onChange={(e) => handleNotificationToggle("systemAlerts", e)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>
        </ul>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Two-Factor Authentication
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-900">Enable 2FA</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={twoFaEnabled} onChange={handleTwoFaToggle} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Add an extra layer of security to your account.
        </p>
        <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          Setup 2FA
        </button>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Session Management
        </h3>
        <ul className="space-y-3">
          {sessions.map((session, index) => (
            <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{session.device}</p>
                <p className="text-sm text-gray-500">Last active: {new Date(session.last_active).toLocaleString()}</p>
              </div>
              <button 
                onClick={() => handleSignOutSession(session.device)}
                className="text-red-600 hover:text-red-900 text-sm"
              >
                Sign Out
              </button>
            </li>
          ))}
        </ul>
        <button 
          onClick={handleSignOutAll}
          className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
        >
          Sign Out All Sessions
        </button>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme</h3>
        <div className="flex space-x-4">
          <button 
            onClick={() => handleSystemUpdate("theme", "light")}
            className={`p-2 rounded-lg ${systemPrefs.theme === "light" ? "bg-blue-100 border border-blue-500" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            Light
          </button>
          <button 
            onClick={() => handleSystemUpdate("theme", "dark")}
            className={`p-2 rounded-lg ${systemPrefs.theme === "dark" ? "bg-blue-100 border border-blue-500 text-white" : "bg-gray-800 text-white hover:bg-gray-700"}`}
          >
            Dark
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Language</h3>
        <select 
          value={systemPrefs.language}
          onChange={(e) => handleSystemUpdate("language", e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Data Retention
        </h3>
        <p className="text-gray-600 mb-4">Keep logs for</p>
        <select 
          value={systemPrefs.dataRetention}
          onChange={(e) => handleSystemUpdate("dataRetention", e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option>30 days</option>
          <option>90 days</option>
          <option>1 year</option>
        </select>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "account":
        return renderAccountTab();
      case "notifications":
        return renderNotificationsTab();
      case "security":
        return renderSecurityTab();
      case "system":
        return renderSystemTab();
      default:
        return null;
    }
  };

  if (loading && activeTab === "profile") {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />

        <main className="flex-1 ml-0 md:ml-64 p-6 overflow-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">
              Customize your account and preferences.
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md mb-6">
            <nav className="flex space-x-1" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-1 border-b-2 font-medium text-sm rounded-t-lg group ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}>
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className={`w-5 h-5 flex-shrink-0 ${
                        activeTab === tab.id
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={tab.icon}
                      />
                    </svg>
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-md p-6">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;