import React, { useState, useEffect } from 'react';
import { Link, Plus, Trash2, Edit2, RefreshCw, Activity, User, Calendar, Check, X } from 'lucide-react';

export default function CommunicationLinkManager() {
  const [links, setLinks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [activeTab, setActiveTab] = useState('links');
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    linkType: 'email',
    linkUrl: '',
    status: 'active',
    description: ''
  });

  useEffect(() => {
    const sampleLinks = [
      {
        id: 1,
        clientName: 'Acme Corp',
        clientEmail: 'contact@acme.com',
        linkType: 'email',
        linkUrl: 'contact@acme.com',
        status: 'active',
        description: 'Primary email contact',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      },
      {
        id: 2,
        clientName: 'Tech Solutions Inc',
        clientEmail: 'info@techsol.com',
        linkType: 'slack',
        linkUrl: 'https://techsol.slack.com',
        status: 'active',
        description: 'Slack workspace for collaboration',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        lastUpdated: new Date().toISOString()
      }
    ];
    setLinks(sampleLinks);

    const sampleLogs = [
      {
        id: 1,
        linkId: 1,
        action: 'created',
        timestamp: new Date().toISOString(),
        details: 'Link created for Acme Corp'
      },
      {
        id: 2,
        linkId: 2,
        action: 'created',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        details: 'Link created for Tech Solutions Inc'
      }
    ];
    setLogs(sampleLogs);
  }, []);

  const addLog = (linkId, action, details) => {
    const newLog = {
      id: logs.length + 1,
      linkId,
      action,
      timestamp: new Date().toISOString(),
      details
    };
    setLogs([newLog, ...logs]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddLink = () => {
    const newLink = {
      id: links.length + 1,
      ...formData,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    setLinks([...links, newLink]);
    addLog(newLink.id, 'created', `Link created for ${newLink.clientName}`);
    setShowAddModal(false);
    setFormData({
      clientName: '',
      clientEmail: '',
      linkType: 'email',
      linkUrl: '',
      status: 'active',
      description: ''
    });
  };

  const handleEditLink = () => {
    const updatedLinks = links.map(link =>
      link.id === selectedLink.id
        ? { ...link, ...formData, lastUpdated: new Date().toISOString() }
        : link
    );
    setLinks(updatedLinks);
    addLog(selectedLink.id, 'updated', `Link updated for ${formData.clientName}`);
    setShowEditModal(false);
    setSelectedLink(null);
  };

  const handleDeleteLink = (id) => {
    const link = links.find(l => l.id === id);
    setLinks(links.filter(link => link.id !== id));
    addLog(id, 'deleted', `Link deleted for ${link.clientName}`);
  };

  const toggleStatus = (id) => {
    const updatedLinks = links.map(link =>
      link.id === id
        ? {
            ...link,
            status: link.status === 'active' ? 'inactive' : 'active',
            lastUpdated: new Date().toISOString()
          }
        : link
    );
    setLinks(updatedLinks);
    const link = updatedLinks.find(l => l.id === id);
    addLog(id, 'status_changed', `Status changed to ${link.status} for ${link.clientName}`);
  };

  const openEditModal = (link) => {
    setSelectedLink(link);
    setFormData({
      clientName: link.clientName,
      clientEmail: link.clientEmail,
      linkType: link.linkType,
      linkUrl: link.linkUrl,
      status: link.status,
      description: link.description
    });
    setShowEditModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getLinkTypeColor = (type) => {
    const colors = {
      email: 'bg-blue-100 text-blue-800',
      slack: 'bg-purple-100 text-purple-800',
      teams: 'bg-indigo-100 text-indigo-800',
      phone: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Link className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Communication Link Manager</h1>
                <p className="text-gray-600">Track and manage client communication channels</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Links</div>
              <div className="text-3xl font-bold text-blue-600">{links.length}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Links</p>
                <p className="text-2xl font-bold text-green-600">
                  {links.filter(l => l.status === 'active').length}
                </p>
              </div>
              <Check className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Inactive Links</p>
                <p className="text-2xl font-bold text-gray-600">
                  {links.filter(l => l.status === 'inactive').length}
                </p>
              </div>
              <X className="text-gray-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Logs</p>
                <p className="text-2xl font-bold text-blue-600">{logs.length}</p>
              </div>
              <Activity className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('links')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                  activeTab === 'links'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Communication Links
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                  activeTab === 'logs'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Activity Logs
              </button>
            </div>
          </div>

          {activeTab === 'links' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Active Communication Links</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
                >
                  <Plus size={20} />
                  <span>Add New Link</span>
                </button>
              </div>

              <div className="space-y-4">
                {links.map(link => (
                  <div key={link.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{link.clientName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(link.status)}`}>
                            {link.status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLinkTypeColor(link.linkType)}`}>
                            {link.linkType}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <User size={16} />
                            <span>{link.clientEmail}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Link size={16} />
                            <span className="text-blue-600">{link.linkUrl}</span>
                          </div>
                          {link.description && (
                            <p className="mt-2 text-gray-700">{link.description}</p>
                          )}
                          <div className="flex items-center space-x-2 mt-2">
                            <Calendar size={16} />
                            <span>Last updated: {formatDate(link.lastUpdated)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleStatus(link.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                          title="Toggle Status"
                        >
                          <RefreshCw size={18} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => openEditModal(link)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 size={18} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {links.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Link size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No communication links yet. Add your first link to get started.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Activity Logs</h2>
              <div className="space-y-3">
                {logs.map(log => (
                  <div key={log.id} className="border-l-4 border-blue-600 bg-gray-50 p-4 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-gray-800 capitalize">{log.action}</span>
                        <p className="text-gray-600 text-sm mt-1">{log.details}</p>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(log.timestamp)}</span>
                    </div>
                  </div>
                ))}

                {logs.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Activity size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No activity logs yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Communication Link</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Type</label>
                <select
                  name="linkType"
                  value={formData.linkType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="email">Email</option>
                  <option value="slack">Slack</option>
                  <option value="teams">Microsoft Teams</option>
                  <option value="phone">Phone</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                <input
                  type="text"
                  name="linkUrl"
                  value={formData.linkUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleAddLink}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                >
                  Add Link
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Communication Link</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Type</label>
                <select
                  name="linkType"
                  value={formData.linkType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="email">Email</option>
                  <option value="slack">Slack</option>
                  <option value="teams">Microsoft Teams</option>
                  <option value="phone">Phone</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                <input
                  type="text"
                  name="linkUrl"
                  value={formData.linkUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleEditLink}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                >
                  Update Link
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedLink(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}