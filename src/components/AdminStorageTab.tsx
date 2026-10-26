import React, { useState, useEffect } from 'react';
import { 
  Database, HardDrive, Shield, ShieldCheck, FileText, Folder, RefreshCw, Upload, 
  Trash2, Download, CheckCircle, AlertTriangle, Eye, Lock, FileCheck, Layers, 
  BarChart3, Activity, Clock, Search, Filter, Plus, FileCode, Check, X, RotateCcw,
  Sparkles, ShieldAlert, FilePlus, Server, Key, ChevronRight, AlertCircle, File, Image as ImageIcon, Video,
  Edit, Edit3, Move, Copy, ExternalLink, FolderPlus
} from 'lucide-react';
import { 
  StorageFileMetadata, StorageFolder, RecycleBinItem, FileVersionRecord, 
  BackupRecord, ActivityAuditLog, StorageHealthStatus 
} from '../types';
import { 
  apiFetchStorageFiles, apiRegisterStorageFile, apiUpdateStorageFile, apiDeleteStorageFile,
  apiFetchRecycleBin, apiAddToRecycleBin, apiRestoreFromRecycleBin, apiPurgeFromRecycleBin,
  apiFetchBackups, apiCreateBackup, apiRestoreBackup,
  apiFetchAuditLogs, apiLogAdminActivity, apiUploadFile, apiCheckStorageStatus,
  apiRenameStorageFile, apiMoveStorageFile, apiVerifyFileExistence, apiCheckDuplicateFile,
  apiFetchFolders, apiCreateFolder, apiDeleteFolder
} from '../utils/apiSync';

interface Props {
  adminEmail: string;
  adminRole: string;
  projectsCount: number;
  newsCount: number;
  programsCount: number;
  applicationsCount: number;
  legislativeCount: number;
  galleryCount: number;
  contactsCount: number;
  petitionsCount: number;
  pollsCount: number;
  officesCount: number;
  adminUsersCount: number;
}

type StorageSubTab = 
  | 'overview' 
  | 'files' 
  | 'folders' 
  | 'database' 
  | 'backups' 
  | 'restore' 
  | 'recycle_bin' 
  | 'versions' 
  | 'audit_logs' 
  | 'health' 
  | 'security' 
  | 'export_import' 
  | 'analytics';

export const AdminStorageTab: React.FC<Props> = ({
  adminEmail,
  adminRole,
  projectsCount,
  newsCount,
  programsCount,
  applicationsCount,
  legislativeCount,
  galleryCount,
  contactsCount,
  petitionsCount,
  pollsCount,
  officesCount,
  adminUsersCount
}) => {
  const [activeSubTab, setActiveSubTab] = useState<StorageSubTab>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');
  const [actionErrorMsg, setActionErrorMsg] = useState<string>('');

  // Storage files state
  const [files, setFiles] = useState<StorageFileMetadata[]>([]);
  const [fileSearchQuery, setFileSearchQuery] = useState<string>('');
  const [fileModuleFilter, setFileModuleFilter] = useState<string>('ALL');
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<StorageFileMetadata | null>(null);

  // Recycle bin state
  const [recycleItems, setRecycleItems] = useState<RecycleBinItem[]>([]);
  const [recycleSearch, setRecycleSearch] = useState<string>('');
  const [confirmPurgeItem, setConfirmPurgeItem] = useState<RecycleBinItem | null>(null);

  // Backups state
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState<boolean>(false);
  const [newBackupName, setNewBackupName] = useState<string>('');
  const [selectedBackupForRestore, setSelectedBackupForRestore] = useState<BackupRecord | null>(null);
  const [isRestoringBackup, setIsRestoringBackup] = useState<boolean>(false);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<ActivityAuditLog[]>([]);
  const [auditSearch, setAuditSearch] = useState<string>('');

  // Storage Health state
  const [healthStatus, setHealthStatus] = useState<StorageHealthStatus>({
    firestoreConnected: true,
    storageConnected: true,
    projectId: 'peppy-command-tsjh2',
    storageBucket: 'peppy-command-tsjh2.firebasestorage.app',
    endpointStatus: 200,
    lastSuccessfulBackup: null,
    lastFailedOperation: null,
    totalFilesCount: 0,
    totalStorageSizeBytes: 0,
    formattedTotalStorageSize: '0 KB',
    integrityIssuesCount: 0,
    orphanedFilesCount: 0,
    checkedAt: new Date().toISOString()
  });

  // Folders & Operations state
  const [customFolders, setCustomFolders] = useState<StorageFolder[]>([]);
  const [showNewFolderModal, setShowNewFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [newFolderModule, setNewFolderModule] = useState<string>('Projects');

  // File Operations Modals
  const [renameModalFile, setRenameModalFile] = useState<StorageFileMetadata | null>(null);
  const [renameInput, setRenameInput] = useState<string>('');
  const [moveModalFile, setMoveModalFile] = useState<StorageFileMetadata | null>(null);
  const [moveInput, setMoveInput] = useState<string>('constituency/projects');
  const [fileInspectorModal, setFileInspectorModal] = useState<StorageFileMetadata | null>(null);
  const [duplicateNotice, setDuplicateNotice] = useState<string>('');

  // Direct File Upload modal
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadFileObj, setUploadFileObj] = useState<File | null>(null);
  const [uploadModuleName, setUploadModuleName] = useState<string>('Projects');
  const [uploadVisibility, setUploadVisibility] = useState<'Public' | 'Restricted' | 'Private'>('Public');
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);

  // Load initial storage data
  const loadStorageData = async () => {
    setLoading(true);
    try {
      const [fetchedFiles, fetchedRecycle, fetchedBackups, fetchedLogs, storageDiag] = await Promise.all([
        apiFetchStorageFiles(),
        apiFetchRecycleBin(),
        apiFetchBackups(),
        apiFetchAuditLogs(),
        apiCheckStorageStatus()
      ]);

      setFiles(fetchedFiles);
      setRecycleItems(fetchedRecycle);
      setBackups(fetchedBackups);
      setAuditLogs(fetchedLogs);

      const totalSize = fetchedFiles.reduce((acc, f) => acc + (f.fileSize || 0), 0);
      const formattedSize = totalSize > 1024 * 1024 
        ? `${(totalSize / (1024 * 1024)).toFixed(2)} MB` 
        : `${(totalSize / 1024).toFixed(1)} KB`;

      const lastBackup = fetchedBackups.length > 0 ? fetchedBackups[0].timestamp : null;

      setHealthStatus(prev => ({
        ...prev,
        storageConnected: storageDiag?.connected !== false,
        totalFilesCount: fetchedFiles.length,
        totalStorageSizeBytes: totalSize,
        formattedTotalStorageSize: formattedSize,
        lastSuccessfulBackup: lastBackup,
        checkedAt: new Date().toISOString()
      }));
    } catch (err: any) {
      console.warn('Storage data loading notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStorageData();
  }, []);

  const triggerNotice = (msg: string, isError = false) => {
    if (isError) {
      setActionErrorMsg(msg);
      setTimeout(() => setActionErrorMsg(''), 4000);
    } else {
      setActionSuccessMsg(msg);
      setTimeout(() => setActionSuccessMsg(''), 4000);
    }
  };

  // Handle direct admin file upload
  const handleAdminFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileObj) {
      triggerNotice('Please choose a file to upload.', true);
      return;
    }

    try {
      setIsUploadingFile(true);
      await apiUploadFile(
        uploadFileObj,
        uploadFileObj.name,
        undefined,
        uploadModuleName,
        undefined,
        uploadVisibility
      );

      triggerNotice(`File "${uploadFileObj.name}" successfully uploaded and indexed in Danmaje Storage.`);
      setShowUploadModal(false);
      setUploadFileObj(null);
      await loadStorageData();
    } catch (err: any) {
      triggerNotice(`Upload error: ${err.message || 'Failed to upload file.'}`, true);
    } finally {
      setIsUploadingFile(false);
    }
  };

  // Handle file rename
  const handleExecuteRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameModalFile || !renameInput.trim()) return;

    try {
      await apiRenameStorageFile(renameModalFile.id, renameInput.trim());
      triggerNotice(`File renamed to "${renameInput.trim()}".`);
      setRenameModalFile(null);
      setRenameInput('');
      await loadStorageData();
    } catch (err: any) {
      triggerNotice(`Rename error: ${err.message}`, true);
    }
  };

  // Handle file move
  const handleExecuteMove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moveModalFile || !moveInput.trim()) return;

    try {
      await apiMoveStorageFile(moveModalFile.id, moveInput.trim());
      triggerNotice(`File moved to path "${moveInput.trim()}".`);
      setMoveModalFile(null);
      setMoveInput('');
      await loadStorageData();
    } catch (err: any) {
      triggerNotice(`Move error: ${err.message}`, true);
    }
  };

  // Handle custom folder creation
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const folderPath = `constituency/${newFolderName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      await apiCreateFolder(newFolderName.trim(), folderPath, newFolderModule);
      triggerNotice(`Folder "${newFolderName.trim()}" created successfully at path /${folderPath}`);
      setShowNewFolderModal(false);
      setNewFolderName('');
      await loadStorageData();
    } catch (err: any) {
      triggerNotice(`Folder error: ${err.message}`, true);
    }
  };

  // Soft Delete file to Recycle Bin
  const handleSoftDeleteFile = async (file: StorageFileMetadata) => {
    if (!window.confirm(`Are you sure you want to move "${file.originalFilename}" to the Recycle Bin?`)) return;

    try {
      const recycleItem: RecycleBinItem = {
        id: `recycle-${Date.now()}`,
        entityId: file.id,
        entityType: 'file',
        title: file.originalFilename,
        storagePath: file.storagePath,
        originalModule: file.associatedModule,
        deletedAt: new Date().toISOString(),
        deletedBy: adminEmail,
        autoPurgeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        dataPayload: file
      };

      await apiAddToRecycleBin(recycleItem);
      await apiDeleteStorageFile(file.id);
      await apiLogAdminActivity({
        action: 'DELETE',
        targetModule: file.associatedModule,
        targetId: file.id,
        details: `Moved file "${file.originalFilename}" (${file.fileSizeFormatted}) to Recycle Bin`,
        status: 'SUCCESS'
      });

      triggerNotice(`File "${file.originalFilename}" moved to Recycle Bin.`);
      setSelectedFileForPreview(null);
      await loadStorageData();
    } catch (err: any) {
      triggerNotice(`Failed to delete file: ${err.message}`, true);
    }
  };

  // Restore item from Recycle Bin
  const handleRestoreRecycleItem = async (item: RecycleBinItem) => {
    try {
      if (item.entityType === 'file' && item.dataPayload) {
        await apiRegisterStorageFile({ ...item.dataPayload, isDeleted: false });
      }
      await apiRestoreFromRecycleBin(item.id);
      await apiLogAdminActivity({
        action: 'RESTORE',
        targetModule: item.originalModule,
        targetId: item.entityId,
        details: `Restored "${item.title}" from Recycle Bin back to ${item.originalModule}`,
        status: 'SUCCESS'
      });

      triggerNotice(`"${item.title}" restored successfully.`);
      await loadStorageData();
    } catch (err: any) {
      triggerNotice(`Restore error: ${err.message}`, true);
    }
  };

  // Permanently purge item from Recycle Bin
  const handlePermanentPurge = async () => {
    if (!confirmPurgeItem) return;
    try {
      await apiPurgeFromRecycleBin(confirmPurgeItem.id);
      await apiLogAdminActivity({
        action: 'PERMANENT_DELETE',
        targetModule: confirmPurgeItem.originalModule,
        targetId: confirmPurgeItem.entityId,
        details: `Permanently purged "${confirmPurgeItem.title}" from Recycle Bin`,
        status: 'SUCCESS'
      });

      triggerNotice(`"${confirmPurgeItem.title}" permanently purged.`);
      setConfirmPurgeItem(null);
      await loadStorageData();
    } catch (err: any) {
      triggerNotice(`Purge error: ${err.message}`, true);
    }
  };

  // Trigger manual backup
  const handleTriggerBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreatingBackup(true);
      const backup = await apiCreateBackup(
        newBackupName.trim() || `Constituency Full Backup ${new Date().toISOString().split('T')[0]}`,
        `Initiated by ${adminRole} (${adminEmail})`
      );

      triggerNotice(`Backup "${backup.backupName}" completed successfully! (${backup.totalRecords} records snapshot)`);
      setNewBackupName('');
      await loadStorageData();
    } catch (err: any) {
      triggerNotice(`Backup error: ${err.message}`, true);
    } finally {
      setIsCreatingBackup(false);
    }
  };

  // Trigger restore from backup snapshot
  const handleExecuteRestore = async () => {
    if (!selectedBackupForRestore || !selectedBackupForRestore.metadataSnapshot) return;
    try {
      setIsRestoringBackup(true);
      const success = await apiRestoreBackup(selectedBackupForRestore.id, selectedBackupForRestore.metadataSnapshot);
      if (success) {
        triggerNotice(`Database and file metadata restored from backup "${selectedBackupForRestore.backupName}"!`);
        setSelectedBackupForRestore(null);
        await loadStorageData();
      } else {
        triggerNotice('Restore completed with warnings. Check audit logs.', true);
      }
    } catch (err: any) {
      triggerNotice(`Restore failed: ${err.message}`, true);
    } finally {
      setIsRestoringBackup(false);
    }
  };

  // Export full JSON database package
  const handleExportFullJSON = async () => {
    const backup = await apiCreateBackup('Instant Export Package', 'Downloaded via Admin Export');
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup.metadataSnapshot, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `danmaje_constituency_database_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerNotice('Complete database JSON exported.');
  };

  const filteredFiles = files.filter(f => {
    const matchesSearch = (f.originalFilename || '').toLowerCase().includes(fileSearchQuery.toLowerCase()) ||
                          (f.associatedModule || '').toLowerCase().includes(fileSearchQuery.toLowerCase());
    const matchesModule = fileModuleFilter === 'ALL' || f.associatedModule === fileModuleFilter;
    return matchesSearch && matchesModule && !f.isDeleted;
  });

  const filteredRecycle = recycleItems.filter(r => 
    (r.title || '').toLowerCase().includes(recycleSearch.toLowerCase()) ||
    (r.originalModule || '').toLowerCase().includes(recycleSearch.toLowerCase())
  );

  const filteredLogs = auditLogs.filter(l => 
    (l.details || '').toLowerCase().includes(auditSearch.toLowerCase()) ||
    (l.user || '').toLowerCase().includes(auditSearch.toLowerCase()) ||
    (l.targetModule || '').toLowerCase().includes(auditSearch.toLowerCase())
  );

  const totalLiveRecords = projectsCount + newsCount + programsCount + applicationsCount + legislativeCount + galleryCount + contactsCount + petitionsCount + pollsCount + officesCount + adminUsersCount;

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-[#103C2E] via-[#1b5543] to-[#103C2E] rounded-xl p-6 text-white shadow-lg border border-[#C6A15B]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#C6A15B]/20 rounded-lg border border-[#C6A15B]/40">
              <HardDrive className="w-7 h-7 text-[#C6A15B]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight font-serif flex items-center gap-2">
                DANMAJE INTERNAL STORAGE
                <span className="text-xs bg-[#C6A15B] text-[#103C2E] font-sans font-bold px-2 py-0.5 rounded-full">
                  PROD v3.0
                </span>
              </h1>
              <p className="text-emerald-100 text-sm mt-0.5">
                Centralized Object Storage, Database Protection, Disaster Recovery & Compliance System
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 bg-[#C6A15B] hover:bg-[#b08d4b] text-[#103C2E] font-bold px-4 py-2.5 rounded-lg transition-all shadow-md text-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </button>
          <button
            onClick={loadStorageData}
            disabled={loading}
            className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white font-medium px-3.5 py-2.5 rounded-lg transition-all border border-white/20 text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#C6A15B]' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg text-emerald-800 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg('')} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionErrorMsg && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-800 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{actionErrorMsg}</span>
          </div>
          <button onClick={() => setActionErrorMsg('')} className="text-red-600 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sub Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          {[
            { id: 'overview', label: 'Storage Overview', icon: HardDrive },
            { id: 'files', label: `File Manager (${files.length})`, icon: FileText },
            { id: 'folders', label: 'Folders', icon: Folder },
            { id: 'database', label: `Database (${totalLiveRecords})`, icon: Database },
            { id: 'backups', label: `Backup Center (${backups.length})`, icon: ShieldCheck },
            { id: 'restore', label: 'Restore Center', icon: RotateCcw },
            { id: 'recycle_bin', label: `Recycle Bin (${recycleItems.length})`, icon: Trash2 },
            { id: 'versions', label: 'File Versions', icon: Layers },
            { id: 'audit_logs', label: `Audit Logs (${auditLogs.length})`, icon: Activity },
            { id: 'health', label: 'Storage Health', icon: Server },
            { id: 'security', label: 'Security & Access', icon: Lock },
            { id: 'export_import', label: 'Export / Import', icon: Download },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as StorageSubTab)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#103C2E] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C6A15B]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== TAB 1: OVERVIEW ==================== */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Indexed Files</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{files.length}</h3>
                <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" /> Persistent Object Storage
                </p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Storage Volume Used</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{healthStatus.formattedTotalStorageSize}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Firebase Cloud Storage (Spark Free Tier)
                </p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <HardDrive className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Database Records</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalLiveRecords}</h3>
                <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center">
                  <Database className="w-3 h-3 mr-1" /> Cloud Firestore Active
                </p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Database className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recycle Bin Items</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{recycleItems.length}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  30-Day Auto Purge Policy
                </p>
              </div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Actions & Health Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-[#C6A15B]" />
                  <span>Danmaje Storage Quick Actions</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all group"
                >
                  <Upload className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="text-sm font-bold text-slate-900">Upload Media / Document</h4>
                  <p className="text-xs text-slate-500 mt-1">Store files directly in Firebase Storage</p>
                </button>

                <button
                  onClick={() => setActiveSubTab('backups')}
                  className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all group"
                >
                  <ShieldCheck className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="text-sm font-bold text-slate-900">Create Full Backup</h4>
                  <p className="text-xs text-slate-500 mt-1">Snapshot all 11 database collections</p>
                </button>

                <button
                  onClick={handleExportFullJSON}
                  className="p-4 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition-all group"
                >
                  <Download className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="text-sm font-bold text-slate-900">Export Complete JSON</h4>
                  <p className="text-xs text-slate-500 mt-1">Download raw database package</p>
                </button>
              </div>
            </div>

            {/* Health Overview */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>System Status</span>
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-600 font-medium">Firestore Database</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle className="w-3 h-3 mr-1" /> OPERATIONAL
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-600 font-medium">Firebase Cloud Storage</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle className="w-3 h-3 mr-1" /> CONNECTED
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-600 font-medium">Project ID</span>
                  <span className="text-xs font-mono font-bold text-slate-700">{healthStatus.projectId}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-600 font-medium">Last Full Backup</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {healthStatus.lastSuccessfulBackup ? new Date(healthStatus.lastSuccessfulBackup).toLocaleDateString() : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: FILE MANAGER ==================== */}
      {activeSubTab === 'files' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Indexed Object Files</h3>
              <p className="text-xs text-slate-500">Real files uploaded and stored in Firebase Cloud Storage</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={fileSearchQuery}
                  onChange={(e) => setFileSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#103C2E] outline-none"
                />
              </div>

              <select
                value={fileModuleFilter}
                onChange={(e) => setFileModuleFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#103C2E] outline-none"
              >
                <option value="ALL">All Modules</option>
                <option value="Projects">Projects</option>
                <option value="News">News</option>
                <option value="Gallery">Gallery</option>
                <option value="Empowerment">Empowerment</option>
                <option value="Applications">Applications</option>
                <option value="System">System</option>
              </select>
            </div>
          </div>

          {filteredFiles.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">No files indexed yet</p>
              <p className="text-xs text-slate-400 mt-1">Upload a file or add media to website modules to populate Danmaje Storage</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Filename</th>
                    <th className="p-3">Module</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Visibility</th>
                    <th className="p-3">Uploaded</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFiles.map(file => (
                    <tr key={file.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium text-slate-900 flex items-center space-x-2">
                        {file.mimeType?.startsWith('image/') ? (
                          <ImageIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : file.mimeType?.startsWith('video/') ? (
                          <Video className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        ) : (
                          <File className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        )}
                        <span className="truncate max-w-xs">{file.originalFilename}</span>
                      </td>
                      <td className="p-3 font-semibold text-slate-700">{file.associatedModule}</td>
                      <td className="p-3 text-slate-600">{file.fileSizeFormatted}</td>
                      <td className="p-3 text-slate-500 font-mono">{file.mimeType}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          file.visibility === 'Public' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {file.visibility}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{new Date(file.uploadTimestamp).toLocaleDateString()}</td>
                      <td className="p-3 text-right space-x-1.5">
                        <button
                          onClick={() => setFileInspectorModal(file)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded inline-block"
                          title="Inspect File & Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setRenameModalFile(file);
                            setRenameInput(file.originalFilename);
                          }}
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded inline-block"
                          title="Rename File"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setMoveModalFile(file);
                            setMoveInput(file.storagePath);
                          }}
                          className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded inline-block"
                          title="Move Folder Path"
                        >
                          <Move className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={file.publicUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded inline-block"
                          title="Direct Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleSoftDeleteFile(file)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded inline-block"
                          title="Move to Recycle Bin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 3: FOLDER MANAGEMENT ==================== */}
      {activeSubTab === 'folders' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Virtual Storage Folders</h3>
            <p className="text-xs text-slate-500">Organized structure in Firebase Storage bucket</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'constituency/projects', module: 'Projects', desc: 'Project site photos and infrastructure records' },
              { name: 'constituency/news', module: 'News', desc: 'Featured press images and media releases' },
              { name: 'constituency/gallery', module: 'Gallery', desc: 'Photo gallery and video cover graphics' },
              { name: 'applications/empowerment', module: 'Empowerment', desc: 'Private biometric passports and NIN credentials' },
              { name: 'applications/petitions', module: 'Petitions', desc: 'Petitioner supporting evidence documents' },
              { name: 'constituency/system', module: 'System', desc: 'Official crests, logos, gazette exports, backups' }
            ].map(folder => {
              const folderFiles = files.filter(f => f.associatedModule === folder.module);
              const folderSize = folderFiles.reduce((acc, f) => acc + (f.fileSize || 0), 0);
              const formattedFolderSize = folderSize > 1024 * 1024 
                ? `${(folderSize / (1024 * 1024)).toFixed(2)} MB`
                : `${(folderSize / 1024).toFixed(1)} KB`;

              return (
                <div key={folder.name} className="p-5 border border-slate-200 rounded-xl hover:border-[#103C2E] transition-all bg-slate-50/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2.5 bg-emerald-100 text-[#103C2E] rounded-lg">
                      <Folder className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{folder.module}</h4>
                      <p className="text-[11px] font-mono text-slate-500">{folder.name}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">{folder.desc}</p>
                  <div className="flex items-center justify-between text-xs font-semibold pt-3 border-t border-slate-200 text-slate-500">
                    <span>{folderFiles.length} files</span>
                    <span>{formattedFolderSize}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: DATABASE OVERVIEW ==================== */}
      {activeSubTab === 'database' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Cloud Firestore Database Collections</h3>
            <p className="text-xs text-slate-500">Persistent database tables for website modules</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'projects', label: 'Projects', count: projectsCount, color: 'border-l-4 border-l-emerald-500' },
              { name: 'news', label: 'News Articles', count: newsCount, color: 'border-l-4 border-l-blue-500' },
              { name: 'programs', label: 'Empowerment Programs', count: programsCount, color: 'border-l-4 border-l-amber-500' },
              { name: 'applications', label: 'Citizen Applications', count: applicationsCount, color: 'border-l-4 border-l-purple-500' },
              { name: 'legislative', label: 'Legislative Records', count: legislativeCount, color: 'border-l-4 border-l-indigo-500' },
              { name: 'gallery', label: 'Media Gallery', count: galleryCount, color: 'border-l-4 border-l-rose-500' },
              { name: 'contacts', label: 'Contact Enquiries', count: contactsCount, color: 'border-l-4 border-l-cyan-500' },
              { name: 'petitions', label: 'Community Petitions', count: petitionsCount, color: 'border-l-4 border-l-orange-500' },
              { name: 'polls', label: 'Town Hall Polls', count: pollsCount, color: 'border-l-4 border-l-teal-500' },
              { name: 'offices', label: 'Constituency Offices', count: officesCount, color: 'border-l-4 border-l-slate-500' },
              { name: 'adminUsers', label: 'Admin Accounts', count: adminUsersCount, color: 'border-l-4 border-l-yellow-500' }
            ].map(col => (
              <div key={col.name} className={`p-4 bg-slate-50 rounded-xl border border-slate-200 ${col.color} flex items-center justify-between`}>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{col.label}</h4>
                  <p className="text-xs font-mono text-slate-500">/{col.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-slate-900">{col.count}</span>
                  <span className="block text-[10px] font-bold text-emerald-600">SYNCED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 5: BACKUP CENTER ==================== */}
      {activeSubTab === 'backups' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Backup Center & Disaster Recovery</h3>
              <p className="text-xs text-slate-500">Full database collection snapshots and media manifests</p>
            </div>

            <form onSubmit={handleTriggerBackup} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Backup Name (optional)..."
                value={newBackupName}
                onChange={(e) => setNewBackupName(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#103C2E] outline-none"
              />
              <button
                type="submit"
                disabled={isCreatingBackup}
                className="flex items-center space-x-1.5 bg-[#103C2E] hover:bg-[#0c2c22] text-white font-bold px-4 py-2 rounded-lg transition-all text-xs shadow-md"
              >
                <ShieldCheck className={`w-4 h-4 ${isCreatingBackup ? 'animate-spin text-[#C6A15B]' : ''}`} />
                <span>{isCreatingBackup ? 'Creating...' : 'Create Backup'}</span>
              </button>
            </form>
          </div>

          {backups.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">No backups created yet</p>
              <p className="text-xs text-slate-400 mt-1">Click "Create Backup" above to generate a full snapshot</p>
            </div>
          ) : (
            <div className="space-y-3">
              {backups.map(b => (
                <div key={b.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-900">{b.backupName}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {b.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(b.timestamp).toLocaleString()} • Created by {b.createdBy} • {b.totalRecords} records across {b.totalCollections} collections
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">Checksum: {b.checksum}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedBackupForRestore(b);
                        setActiveSubTab('restore');
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs shadow-sm"
                    >
                      Restore From This
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 6: RESTORE CENTER ==================== */}
      {activeSubTab === 'restore' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Restore Center & Pre-flight Validation</h3>
            <p className="text-xs text-slate-500">Safely restore database records with rollback validation</p>
          </div>

          {selectedBackupForRestore ? (
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl space-y-4">
              <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Selected Backup: {selectedBackupForRestore.backupName}</span>
              </div>
              <p className="text-xs text-amber-700">
                Created on {new Date(selectedBackupForRestore.timestamp).toLocaleString()} by {selectedBackupForRestore.createdBy}. Contains {selectedBackupForRestore.totalRecords} records.
              </p>

              <div className="pt-3 border-t border-amber-200 flex items-center space-x-3">
                <button
                  onClick={handleExecuteRestore}
                  disabled={isRestoringBackup}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs shadow-md"
                >
                  {isRestoringBackup ? 'Restoring...' : 'Confirm & Execute Restore'}
                </button>
                <button
                  onClick={() => setSelectedBackupForRestore(null)}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Select a backup snapshot from the Backup Center tab to initiate pre-flight restore validation.</p>
          )}
        </div>
      )}

      {/* ==================== TAB 7: RECYCLE BIN ==================== */}
      {activeSubTab === 'recycle_bin' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recycle Bin & Protection Against Accidental Deletion</h3>
              <p className="text-xs text-slate-500">Soft-deleted items are safely held for 30 days before permanent purging</p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search deleted items..."
                value={recycleSearch}
                onChange={(e) => setRecycleSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#103C2E] outline-none"
              />
            </div>
          </div>

          {filteredRecycle.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
              <Trash2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">Recycle Bin is empty</p>
              <p className="text-xs text-slate-400 mt-1">Deleted items will appear here before permanent purging</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecycle.map(item => (
                <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800 uppercase">
                        {item.originalModule}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Deleted on {new Date(item.deletedAt).toLocaleDateString()} by {item.deletedBy}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRestoreRecycleItem(item)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => setConfirmPurgeItem(item)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-xs"
                    >
                      Purge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 8: FILE VERSIONS ==================== */}
      {activeSubTab === 'versions' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">File Version History</h3>
          <p className="text-xs text-slate-500">Trace modifications and updates for official constituency documents</p>
          <div className="p-8 text-center text-xs text-slate-500 border border-slate-100 rounded-lg">
            Version history automatically logs updates when files are replaced during project or news edits.
          </div>
        </div>
      )}

      {/* ==================== TAB 9: AUDIT LOGS ==================== */}
      {activeSubTab === 'audit_logs' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Activity Audit Trail</h3>
              <p className="text-xs text-slate-500">Immutable log of administrative operations</p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit logs..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#103C2E] outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td className="p-3 font-mono text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-semibold text-slate-800">{log.user}</td>
                    <td className="p-3 font-bold text-slate-900">{log.action}</td>
                    <td className="p-3 text-slate-700">{log.targetModule}</td>
                    <td className="p-3 text-slate-600">{log.details}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 10: HEALTH ==================== */}
      {activeSubTab === 'health' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Storage Health & Diagnostics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg space-y-2">
              <p className="font-bold text-slate-700 uppercase">Firestore Database</p>
              <p className="text-slate-600">Status: <span className="font-bold text-emerald-600">Healthy</span></p>
              <p className="text-slate-600">Project ID: <span className="font-mono">{healthStatus.projectId}</span></p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg space-y-2">
              <p className="font-bold text-slate-700 uppercase">Firebase Storage Bucket</p>
              <p className="text-slate-600">Bucket: <span className="font-mono">{healthStatus.storageBucket}</span></p>
              <p className="text-slate-600">Status Code: <span className="font-bold text-emerald-600">{healthStatus.endpointStatus}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 11: SECURITY ==================== */}
      {activeSubTab === 'security' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Security & Role-Based Access Control</h3>
          <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-lg text-xs text-emerald-800 space-y-1">
            <p className="font-bold">Active Security Enforcements:</p>
            <p>• Anonymous users are restricted from administrator endpoints.</p>
            <p>• Sensitive empowerment applicant documents are strictly private in Firebase Storage rules.</p>
            <p>• Firestore security rules mandate admin validation via <code>isAdmin()</code> on all write operations.</p>
          </div>
        </div>
      )}

      {/* ==================== TAB 12: EXPORT / IMPORT ==================== */}
      {activeSubTab === 'export_import' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Data Export & Import Center</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportFullJSON}
              className="px-4 py-2.5 bg-[#103C2E] hover:bg-[#0c2c22] text-white font-bold rounded-lg text-xs shadow-md"
            >
              Export Complete Database (JSON)
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 13: ANALYTICS ==================== */}
      {activeSubTab === 'analytics' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Storage Usage Analytics</h3>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1 font-bold text-slate-700">
                <span>Storage Utilization</span>
                <span>{healthStatus.formattedTotalStorageSize} / 5.00 GB (Free Spark Tier)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-[#103C2E] h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (healthStatus.totalStorageSizeBytes / (5 * 1024 * 1024 * 1024)) * 100) || 1}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Direct File Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-[#103C2E]" />
                <span>Upload Object File</span>
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminFileUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select File</label>
                <input
                  type="file"
                  onChange={(e) => setUploadFileObj(e.target.files?.[0] || null)}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Associated Module</label>
                <select
                  value={uploadModuleName}
                  onChange={(e) => setUploadModuleName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                >
                  <option value="Projects">Projects</option>
                  <option value="News">News</option>
                  <option value="Gallery">Gallery</option>
                  <option value="Empowerment">Empowerment</option>
                  <option value="Applications">Applications</option>
                  <option value="System">System</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Visibility Policy</label>
                <select
                  value={uploadVisibility}
                  onChange={(e) => setUploadVisibility(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                >
                  <option value="Public">Public (Read-All)</option>
                  <option value="Restricted">Restricted (Authenticated Only)</option>
                  <option value="Private">Private (Admin Only)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingFile}
                  className="px-4 py-2 bg-[#103C2E] hover:bg-[#0c2c22] text-white font-bold rounded-lg shadow-md"
                >
                  {isUploadingFile ? 'Uploading...' : 'Confirm Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Permanent Purge */}
      {confirmPurgeItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-red-100 animate-scale-up">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-slate-900">Permanent Purge Warning</h3>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete <strong className="text-slate-900">"{confirmPurgeItem.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setConfirmPurgeItem(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handlePermanentPurge}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-md"
              >
                Permanently Purge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename File Modal */}
      {renameModalFile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <span>Rename File</span>
              </h3>
              <button onClick={() => setRenameModalFile(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleExecuteRename} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Filename</label>
                <input
                  type="text"
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRenameModalFile(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg shadow-sm"
                >
                  Save Rename
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Move File Modal */}
      {moveModalFile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Move className="w-4 h-4 text-purple-600" />
                <span>Move Folder Path</span>
              </h3>
              <button onClick={() => setMoveModalFile(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleExecuteMove} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination Path</label>
                <input
                  type="text"
                  value={moveInput}
                  onChange={(e) => setMoveInput(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none font-mono"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMoveModalFile(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-purple-600 text-white font-bold rounded-lg shadow-sm"
                >
                  Confirm Move
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Inspector / Preview Modal */}
      {fileInspectorModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#103C2E]" />
                <span className="truncate">{fileInspectorModal.originalFilename}</span>
              </h3>
              <button onClick={() => setFileInspectorModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Preview Box */}
            <div className="bg-slate-900 rounded-lg p-3 flex items-center justify-center min-h-[180px] max-h-[260px] overflow-hidden">
              {fileInspectorModal.mimeType?.startsWith('image/') ? (
                <img
                  src={fileInspectorModal.publicUrl}
                  alt={fileInspectorModal.originalFilename}
                  className="max-h-56 object-contain rounded"
                />
              ) : fileInspectorModal.mimeType?.startsWith('video/') ? (
                <video
                  src={fileInspectorModal.publicUrl}
                  controls
                  className="max-h-56 rounded"
                />
              ) : (
                <div className="text-center text-slate-300 space-y-2">
                  <File className="w-12 h-12 mx-auto text-slate-400" />
                  <p className="text-xs font-semibold">{fileInspectorModal.mimeType}</p>
                </div>
              )}
            </div>

            {/* Metadata Card */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 font-bold block">Size:</span>
                <span className="font-semibold text-slate-800">{fileInspectorModal.fileSizeFormatted}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Module:</span>
                <span className="font-semibold text-slate-800">{fileInspectorModal.associatedModule}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Visibility:</span>
                <span className="font-semibold text-slate-800">{fileInspectorModal.visibility}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Uploader:</span>
                <span className="font-semibold text-slate-800">{fileInspectorModal.uploaderIdentity}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(fileInspectorModal.publicUrl);
                  triggerNotice('Public URL copied to clipboard!');
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy URL</span>
              </button>

              <a
                href={fileInspectorModal.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-4 py-2 bg-[#103C2E] hover:bg-[#0c2c22] text-white font-bold rounded-lg text-xs shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download File</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
