import React, { useState, useEffect } from 'react';
import { 
  User, 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken, 
  db,
  handleFirestoreError,
  OperationType
} from '../firebase';
import { 
  listDriveFiles, 
  uploadLegalFileToDrive, 
  createPortfolioSheet, 
  sendLegalEmail, 
  createGmailDraft, 
  listCalendarEvents, 
  scheduleCourtEvent, 
  createGoogleDoc, 
  listChatSpaces, 
  postChatMessage,
  DriveFileItem,
  ChatSpaceItem
} from '../services/googleWorkspaceService';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  UNIFIED_DOCUMENT_METADATA, 
  CUSIP_PORTFOLIO_DATA, 
  ALGORITHM_SUITE, 
  EMAIL_PRESENTATION_PACKAGES,
  RULE_18_EXACTION_ITERATIONS
} from '../data/unifiedDocumentData';
import { 
  FolderGit2, 
  FileSpreadsheet, 
  Mail, 
  Calendar, 
  Video, 
  FileText, 
  MessageSquare, 
  Database, 
  ShieldCheck, 
  ExternalLink, 
  RefreshCw, 
  Send, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Check, 
  Sparkles, 
  Layers, 
  HardDrive,
  LogOut,
  UserCheck,
  Zap
} from 'lucide-react';

interface ActivityLog {
  id: string;
  service: string;
  action: string;
  resourceTitle?: string;
  timestamp: any;
  status: string;
  uid: string;
}

export const GoogleWorkspaceHub: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'drive' | 'sheets' | 'gmail' | 'calendar' | 'docs' | 'chat'>('drive');

  // Loading and feedback states
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Drive state
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  
  // Calendar state
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);

  // Chat state
  const [chatSpaces, setChatSpaces] = useState<ChatSpaceItem[]>([]);
  const [selectedChatSpace, setSelectedChatSpace] = useState<string>('');
  const [chatMessageText, setChatMessageText] = useState<string>('');

  // Firestore activity state
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // Confirmation Modal State (MANDATORY User Confirmation for Destructive/Mutating Operations)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: async () => {}
  });

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Listen to Firestore activity log
  useEffect(() => {
    if (!user) {
      setActivities([]);
      return;
    }

    try {
      const q = query(
        collection(db, 'workspace_activity'),
        limit(20)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: ActivityLog[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            list.push({
              id: doc.id,
              service: data.service,
              action: data.action,
              resourceTitle: data.resourceTitle,
              timestamp: data.timestamp,
              status: data.status,
              uid: data.uid
            });
          });
          setActivities(list);
        },
        (error) => {
          console.warn('Firestore onSnapshot listener handled:', error);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Error attaching Firestore listener:', err);
    }
  }, [user]);

  // Log activity to Firestore
  const logActivityToFirestore = async (service: string, action: string, resourceTitle?: string) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'workspace_activity'), {
        service,
        action,
        resourceTitle: resourceTitle || 'N/A',
        timestamp: new Date().toISOString(),
        status: 'Completed',
        uid: user.uid
      });
    } catch (error) {
      console.error('Failed to log workspace activity:', error);
    }
  };

  // Google Login Handler
  const handleLogin = async () => {
    setIsLoggingIn(true);
    setStatusMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        setStatusMessage({
          type: 'success',
          text: `Connected to Google Workspace as ${res.user.email} with Drive, Sheets, Gmail, Calendar, Docs, Chat, and Meet enabled.`
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to authenticate with Google.'
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setDriveFiles([]);
    setCalendarEvents([]);
    setChatSpaces([]);
    setStatusMessage({ type: 'info', text: 'Signed out of Google Workspace.' });
  };

  // --- DRIVE ACTIONS ---
  const handleFetchDriveFiles = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const files = await listDriveFiles(token);
      setDriveFiles(files);
      setStatusMessage({ type: 'success', text: `Loaded ${files.length} files from Google Drive.` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const promptUploadPleadingToDrive = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Upload Omnibus Mandamus Petition to Google Drive',
      description: 'This operation will create a new legal document file "Omnibus_Consolidated_Mandamus_Petition_Baltimore_County.txt" in your Google Drive root directory. Proceed?',
      onConfirm: async () => {
        if (!token) return;
        setIsLoading(true);
        try {
          const content = `IN THE CIRCUIT COURT FOR BALTIMORE COUNTY, MARYLAND (Case No. C-03-CV-26-004128)
AND IN THE U.S. COURT OF APPEALS FOR THE D.C. CIRCUIT (Case No. 24-10492)
IN RE ESTATE OF CAUSTIN LEE MCLAUGHLIN & JUAN JOSE FERNANDEZ

MASTER VERIFIED PETITION FOR MANDAMUS & RULE 18 CONSOLIDATED EXACTION OF LIBERTY
Total Estate Capitalization: $500,000,000.00 Senior Notes
Converted Equities: 45,850,000 Common Shares of Centrus Energy Corp. (NYSE: LEU)
Clearing Venue: The Bank of New York Mellon (DTC Participant Desk)
Co-Custodian: M&T Bank (ABA: 022000046, SWIFT: MANTUS33)

Executed: November 1, 2026`;
          const file = await uploadLegalFileToDrive(token, 'Omnibus_Consolidated_Mandamus_Petition_Baltimore_County.txt', content);
          await logActivityToFirestore('drive', 'Upload File', file.name);
          setStatusMessage({ type: 'success', text: `Successfully uploaded "${file.name}" to Google Drive (ID: ${file.id}).` });
          await handleFetchDriveFiles();
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message });
        } finally {
          setIsLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // --- SHEETS ACTIONS ---
  const promptExportPortfolioToSheets = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Create Google Spreadsheet with $500M CUSIP Portfolio',
      description: 'This will create a new Google Spreadsheet in your Google Drive containing the complete 1999 Indenture CUSIP Reconciliation (Series A $350M, Series B $150M, 45,850,000 LEU shares) and SEC Form 13F Institutional Audit Table. Proceed?',
      onConfirm: async () => {
        if (!token) return;
        setIsLoading(true);
        try {
          const headers = ['Issuer', 'Title of Class', 'CUSIP', 'Value ($1,000s)', 'Shares / Principal', 'Discretion', 'Clearing Status'];
          const rows: (string | number)[][] = [headers];
          
          CUSIP_PORTFOLIO_DATA.forEach(item => {
            rows.push([
              item.issuer,
              item.titleOfClass,
              item.cusip,
              item.valueK,
              item.sharesOrPrincipal,
              item.discretion,
              item.relevance
            ]);
          });

          const sheet = await createPortfolioSheet(token, 'USEC_Centrus_500M_CUSIP_Portfolio_Settlement', rows);
          await logActivityToFirestore('sheets', 'Create Spreadsheet', sheet.title);
          setStatusMessage({
            type: 'success',
            text: `Created Google Sheet "${sheet.title}". URL: ${sheet.spreadsheetUrl}`
          });
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message });
        } finally {
          setIsLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const promptExportAlgorithmsToSheets = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Export 31 Financial Algorithms to Google Sheets',
      description: 'This will create a new Google Sheet containing all 31 algorithms, modules, formulations, and computational complexities. Proceed?',
      onConfirm: async () => {
        if (!token) return;
        setIsLoading(true);
        try {
          const headers = ['#', 'ID', 'Module', 'Algorithm Name', 'Purpose', 'Formulation', 'Complexity', 'Status'];
          const rows: (string | number)[][] = [headers];
          
          ALGORITHM_SUITE.forEach(a => {
            rows.push([a.num, a.id, a.module, a.name, a.purpose, a.formulation, a.complexity, a.register]);
          });

          const sheet = await createPortfolioSheet(token, 'Americana_Trust_31_Algorithm_Master_Suite', rows);
          await logActivityToFirestore('sheets', 'Export Algorithms', sheet.title);
          setStatusMessage({
            type: 'success',
            text: `Created Google Sheet "${sheet.title}".`
          });
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message });
        } finally {
          setIsLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // --- GMAIL ACTIONS ---
  const promptSendEmail = (pkg: typeof EMAIL_PRESENTATION_PACKAGES[0], isDraft: boolean) => {
    setConfirmModal({
      isOpen: true,
      title: isDraft ? `Create Gmail Draft for ${pkg.recipientOrg}` : `Send Email to ${pkg.recipientOrg}`,
      description: isDraft 
        ? `This will create a draft email to "${pkg.toEmail}" in your Gmail account containing the complete legal filing presentation. Proceed?`
        : `Are you sure you want to SEND an email from your Gmail account to "${pkg.toEmail}" with subject "${pkg.subject}"? This cannot be undone.`,
      onConfirm: async () => {
        if (!token) return;
        setIsLoading(true);
        try {
          if (isDraft) {
            await createGmailDraft(token, {
              to: pkg.toEmail,
              cc: pkg.ccEmail,
              subject: pkg.subject,
              body: pkg.emailBody
            });
            await logActivityToFirestore('gmail', 'Create Draft', pkg.subject);
            setStatusMessage({ type: 'success', text: `Draft created in your Gmail for "${pkg.toEmail}".` });
          } else {
            await sendLegalEmail(token, {
              to: pkg.toEmail,
              cc: pkg.ccEmail,
              subject: pkg.subject,
              body: pkg.emailBody
            });
            await logActivityToFirestore('gmail', 'Send Email', pkg.subject);
            setStatusMessage({ type: 'success', text: `Email successfully sent via Gmail to "${pkg.toEmail}".` });
          }
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message });
        } finally {
          setIsLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const promptBatchSendAllEmails = () => {
    setConfirmModal({
      isOpen: true,
      title: '⚡ 1-Click Send All 5 Packages via Gmail API',
      description: `This will dispatch all 5 formal legal packages (Baltimore County Circuit Court, D.C. Circuit Court of Appeals, The Bank of New York Mellon, M&T Bank, and Wyoming Secretary of State) from your connected Gmail account (${user?.email}) and register cryptographic delivery records in Firestore. Proceed?`,
      onConfirm: async () => {
        if (!token) return;
        setIsLoading(true);
        let successCount = 0;
        try {
          for (const pkg of EMAIL_PRESENTATION_PACKAGES) {
            await sendLegalEmail(token, {
              to: pkg.toEmail,
              cc: pkg.ccEmail,
              subject: pkg.subject,
              body: pkg.emailBody
            });
            await logActivityToFirestore('gmail', '1-Click Batch Send', `${pkg.recipientOrg}: ${pkg.subject}`);
            successCount++;
          }
          setStatusMessage({
            type: 'success',
            text: `Successfully dispatched all ${successCount} correspondence packages and exhibits in 1 click via Gmail API!`
          });
        } catch (err: any) {
          setStatusMessage({
            type: successCount > 0 ? 'info' : 'error',
            text: `Dispatched ${successCount}/5 packages. Error: ${err.message}`
          });
        } finally {
          setIsLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // --- CALENDAR & MEET ACTIONS ---
  const handleFetchCalendar = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const items = await listCalendarEvents(token);
      setCalendarEvents(items);
      setStatusMessage({ type: 'success', text: `Retrieved ${items.length} upcoming calendar events.` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const promptScheduleHearing = (withMeet: boolean) => {
    setConfirmModal({
      isOpen: true,
      title: withMeet ? 'Schedule Baltimore County Hearing with Google Meet' : 'Schedule Court Docket Hearing',
      description: `This will create a calendar event "Baltimore County Circuit Court Status Conference (Case C-03-CV-26-004128)" on your primary Google Calendar${withMeet ? ' with an active Google Meet video conference link' : ''}. Proceed?`,
      onConfirm: async () => {
        if (!token) return;
        setIsLoading(true);
        try {
          const startTime = new Date(Date.now() + 86400000 * 2); // 2 days from now
          startTime.setHours(10, 0, 0, 0);
          const endTime = new Date(startTime.getTime() + 3600000); // 1 hour duration

          const ev = await scheduleCourtEvent(token, {
            summary: 'Circuit Court for Baltimore County Hearing (Case No. C-03-CV-26-004128)',
            description: `Omnibus Mandamus, Rule 18 Consolidated Exaction of Liberty, and Indenture Specific Performance Conference.
Petitioner: Caustin Lee McLaughlin & Juan Jose Fernandez
Respondents: BNY Mellon, Computershare, Centrus Energy Corp.
Location: Towson, MD 21204`,
            location: 'Circuit Court for Baltimore County, County Courts Building, Towson, MD 21204',
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            createMeetRoom: withMeet
          });

          await logActivityToFirestore(withMeet ? 'meet' : 'calendar', 'Schedule Event', ev.summary);
          const meetUrl = ev.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video')?.uri;
          setStatusMessage({
            type: 'success',
            text: `Scheduled calendar event! ${meetUrl ? `Google Meet Link: ${meetUrl}` : ''}`
          });
          await handleFetchCalendar();
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message });
        } finally {
          setIsLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // --- DOCS ACTIONS ---
  const promptExportPleadingToDoc = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Export Omnibus Mandamus Petition to Google Docs',
      description: 'This will create an editable Google Doc in your Google Drive titled "Baltimore County Circuit Court & DC Circuit Omnibus Mandamus Petition" containing the full verified legal brief. Proceed?',
      onConfirm: async () => {
        if (!token) return;
        setIsLoading(true);
        try {
          const body = `IN THE CIRCUIT COURT FOR BALTIMORE COUNTY, MARYLAND
CASE NO. C-03-CV-26-004128

IN RE ESTATE OF CAUSTIN LEE MCLAUGHLIN, Debtor-in-Possession
AND JUAN JOSE FERNANDEZ, Co-Trustee

v.

THE BANK OF NEW YORK MELLON, et al.

VERIFIED PETITION FOR PEREMPTORY WRIT OF MANDAMUS,
DECLARATORY JUDGMENT & RULE 18 CONSOLIDATED EXACTION OF LIBERTY

1. Plenary Jurisdiction under Md. Rule 15-701 & 28 U.S.C. § 1651.
2. The $500,000,000.00 Senior Notes Indenture converts into 45,850,000 common shares of Centrus Energy Corp. (NYSE: LEU).
3. Rule 18 Exaction of Liberty Iterations I through IV joined pursuant to Fed. R. Civ. P. 18(a) and Md. Rule 2-303(b).
4. Depository clearing commanded to BNY Mellon DTC Participant desk.

Executed: November 1, 2026`;

          const docResult = await createGoogleDoc(token, 'Baltimore_County_Circuit_Court_Omnibus_Mandamus_Petition', body);
          await logActivityToFirestore('docs', 'Create Document', docResult.title);
          setStatusMessage({
            type: 'success',
            text: `Created Google Doc "${docResult.title}" (ID: ${docResult.documentId}).`
          });
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message });
        } finally {
          setIsLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // --- CHAT ACTIONS ---
  const handleFetchChatSpaces = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const spaces = await listChatSpaces(token);
      setChatSpaces(spaces);
      if (spaces.length > 0 && !selectedChatSpace) {
        setSelectedChatSpace(spaces[0].name);
      }
      setStatusMessage({ type: 'success', text: `Found ${spaces.length} Google Chat spaces.` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const promptPostChatMessage = () => {
    if (!selectedChatSpace || !chatMessageText.trim()) return;
    setConfirmModal({
      isOpen: true,
      title: 'Post Message to Google Chat Space',
      description: `Are you sure you want to post this status update to Chat space "${selectedChatSpace}"?
Message: "${chatMessageText}"`,
      onConfirm: async () => {
        if (!token) return;
        setIsLoading(true);
        try {
          await postChatMessage(token, selectedChatSpace, chatMessageText);
          await logActivityToFirestore('chat', 'Post Message', selectedChatSpace);
          setChatMessageText('');
          setStatusMessage({ type: 'success', text: `Message posted successfully to Google Chat space.` });
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message });
        } finally {
          setIsLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/70 border border-blue-500/40 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-xs font-bold border border-blue-500/30">
                GOOGLE WORKSPACE &amp; CLOUD FIRESTORE
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Google Workspace &amp; Firebase Legal Integration Hub
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Real-time Google Workspace connectivity across <strong>Google Drive</strong>, <strong>Google Sheets</strong>, <strong>Gmail</strong>, <strong>Google Calendar</strong>, <strong>Google Docs</strong>, <strong>Google Chat</strong>, and <strong>Google Meet</strong>, with cloud state persistence backed by Google Cloud Firestore.
            </p>
          </div>

          {/* Auth Action */}
          <div className="shrink-0 flex items-center gap-3">
            {!user ? (
              <button 
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="flex items-center gap-2.5 px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-lg font-semibold text-xs transition-colors shadow-md disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>{isLoggingIn ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-lg border border-slate-700 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="font-mono text-emerald-300 font-semibold">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div className={`mt-4 p-3 rounded-lg text-xs flex items-start justify-between gap-2 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200' 
              : statusMessage.type === 'error'
              ? 'bg-red-950/60 border border-red-500/40 text-red-200'
              : 'bg-indigo-950/60 border border-indigo-500/40 text-indigo-200'
          }`}>
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button 
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              &times;
            </button>
          </div>
        )}
      </div>

      {/* Main Workspace Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'drive', label: 'Google Drive', icon: HardDrive },
          { id: 'sheets', label: 'Google Sheets', icon: FileSpreadsheet },
          { id: 'gmail', label: 'Gmail Dispatch', icon: Mail },
          { id: 'calendar', label: 'Google Calendar & Meet', icon: Calendar },
          { id: 'docs', label: 'Google Docs', icon: FileText },
          { id: 'chat', label: 'Google Chat', icon: MessageSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeWorkspaceTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveWorkspaceTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Unauthenticated notice */}
      {!user && (
        <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-xl text-center space-y-3">
          <HardDrive className="w-8 h-8 text-blue-400 mx-auto" />
          <h3 className="font-bold text-white text-base">Google Workspace Authentication Required</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click <strong>&ldquo;Sign in with Google&rdquo;</strong> above to grant client-side access to Google Drive, Google Sheets, Gmail, Google Calendar, Google Docs, Google Chat, and Google Meet.
          </p>
        </div>
      )}

      {/* Authenticated Panels */}
      {user && (
        <div className="space-y-6">
          {/* TAB 1: GOOGLE DRIVE */}
          {activeWorkspaceTab === 'drive' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-blue-400" />
                    <span>Google Drive Document Storage &amp; Pleading Vault</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Store, organize, and inspect formal court pleadings and liquidation documents directly in Google Drive.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFetchDriveFiles}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh Files</span>
                  </button>
                  <button
                    onClick={promptUploadPleadingToDrive}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Omnibus Pleading</span>
                  </button>
                </div>
              </div>

              {/* File list */}
              <div>
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Recent Drive Files
                </div>
                {driveFiles.length === 0 ? (
                  <div className="p-6 bg-slate-950 rounded-lg border border-slate-800 text-center text-xs text-slate-500">
                    No files loaded yet. Click &ldquo;Refresh Files&rdquo; to browse your Google Drive or &ldquo;Upload Omnibus Pleading&rdquo; to store court records.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {driveFiles.map((file) => (
                      <div key={file.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
                        <div>
                          <div className="font-semibold text-xs text-white truncate" title={file.name}>
                            {file.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {file.mimeType}
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">{file.size ? `${Math.round(Number(file.size)/1024)} KB` : 'Folder/Doc'}</span>
                          {file.webViewLink && (
                            <a 
                              href={file.webViewLink} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-blue-400 hover:underline flex items-center gap-1"
                            >
                              <span>Open in Drive</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE SHEETS */}
          {activeWorkspaceTab === 'sheets' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <span>Google Sheets Portfolio &amp; Algorithmic Export</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Programmatically generate live Google Spreadsheets populated with the $500,000,000.00 CUSIP portfolio, SEC 13F holdings, and the complete 31-algorithm execution suite.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">1. $500M CUSIP Reconciliation Sheet</span>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      SEC 13F Form Data
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Exports USEC Series A (917300AA1, $350M), Series B (917300AB9, $150M), and the 45,850,000 LEU common shares conversion matrix into Google Sheets.
                  </p>
                  <button
                    onClick={promptExportPortfolioToSheets}
                    disabled={isLoading}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Create CUSIP Portfolio Sheet</span>
                  </button>
                </div>

                <div className="p-5 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">2. 31-Algorithm Suite Master Sheet</span>
                    <span className="text-[10px] text-indigo-400 font-mono bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/30">
                      11 Modules Catalog
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Exports all 31 algorithms, mathematical formulations, Big-O complexities, and implementation registers into a structured spreadsheet.
                  </p>
                  <button
                    onClick={promptExportAlgorithmsToSheets}
                    disabled={isLoading}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Create Algorithms Sheet</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GMAIL DISPATCH */}
          {activeWorkspaceTab === 'gmail' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-red-400" />
                  <span>Gmail Legal Presentation Dispatch Hub</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Send or draft authenticated presentment packages directly through your connected Gmail account (<code>{user.email}</code>) to court clerks, BNY Mellon, and counterparties.
                </p>
              </div>

              {/* 1-Click Batch Dispatch Entire Docket Banner */}
              <div className="p-4 bg-gradient-to-r from-indigo-950/80 via-slate-950 to-emerald-950/80 border border-indigo-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    <Zap className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">
                      1-Click Batch Transmit All 5 Packages via Gmail API
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Dispatches all 5 court filings, BNY Mellon DTC instructions, and M&amp;T Bank packages sequentially in one click with live delivery logging.
                    </p>
                  </div>
                </div>

                <button
                  onClick={promptBatchSendAllEmails}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 via-indigo-600 to-emerald-600 hover:brightness-110 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-200" />
                  <span>⚡ 1-Click Send All</span>
                </button>
              </div>

              <div className="space-y-4">
                {EMAIL_PRESENTATION_PACKAGES.map((pkg) => (
                  <div key={pkg.id} className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                      <div>
                        <div className="font-bold text-white text-sm">{pkg.recipientOrg}</div>
                        <div className="text-xs text-slate-400">
                          To: <span className="font-mono text-indigo-300">{pkg.toEmail}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => promptSendEmail(pkg, true)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors cursor-pointer"
                        >
                          Save as Draft
                        </button>
                        <button
                          onClick={() => promptSendEmail(pkg, false)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send via Gmail</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Subject:</strong> {pkg.subject}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      <strong>Attachments ({pkg.attachedDocuments.length}):</strong>{' '}
                      {pkg.attachedDocuments.map(d => d.title).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GOOGLE CALENDAR & MEET */}
          {activeWorkspaceTab === 'calendar' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <span>Google Calendar &amp; Google Meet Court Conferences</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Schedule case hearings and generate Google Meet video conference rooms for Baltimore County Circuit Court (Case No. C-03-CV-26-004128) and D.C. Circuit appeals.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFetchCalendar}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Fetch Calendar</span>
                  </button>
                  <button
                    onClick={() => promptScheduleHearing(true)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Schedule Hearing + Google Meet</span>
                  </button>
                </div>
              </div>

              {/* Upcoming Events */}
              <div>
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Upcoming Court Events
                </div>
                {calendarEvents.length === 0 ? (
                  <div className="p-6 bg-slate-950 rounded-lg border border-slate-800 text-center text-xs text-slate-500">
                    No upcoming events found or not yet fetched. Click &ldquo;Fetch Calendar&rdquo; or schedule a hearing.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {calendarEvents.map((ev) => (
                      <div key={ev.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-xs text-white">{ev.summary}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {ev.start?.dateTime || ev.start?.date} — {ev.location || 'Online'}
                          </div>
                        </div>
                        {ev.hangoutLink && (
                          <a
                            href={ev.hangoutLink}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded text-xs flex items-center gap-1 hover:bg-blue-600/50"
                          >
                            <Video className="w-3 h-3" />
                            <span>Join Meet</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: GOOGLE DOCS */}
          {activeWorkspaceTab === 'docs' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span>Google Docs Legal Brief Synchronization</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Export master pleadings and Rule 18 briefs into Google Docs for team drafting, commentary, and legal formatting.
                </p>
              </div>

              <div className="p-5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-sm">Export Omnibus Verified Pleading to Google Docs</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">
                    Creates a collaborative Google Doc containing the caption, $500M capitalization specifications, Rule 18 exaction iterations, and BNY Mellon directives.
                  </p>
                </div>
                <button
                  onClick={promptExportPleadingToDoc}
                  disabled={isLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow cursor-pointer flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export to Google Docs</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: GOOGLE CHAT */}
          {activeWorkspaceTab === 'chat' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-teal-400" />
                  <span>Google Chat Case Status Broadcaster</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Post real-time status updates and execution notices to your legal team&apos;s Google Chat spaces.
                </p>
              </div>

              <div className="space-y-4 max-w-xl">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleFetchChatSpaces}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Fetch Chat Spaces
                  </button>
                  {chatSpaces.length > 0 && (
                    <select
                      value={selectedChatSpace}
                      onChange={(e) => setSelectedChatSpace(e.target.value)}
                      className="flex-1 p-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 font-mono"
                    >
                      {chatSpaces.map(s => (
                        <option key={s.name} value={s.name}>
                          {s.displayName || s.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 block">Message Text:</label>
                  <textarea
                    rows={3}
                    value={chatMessageText}
                    onChange={(e) => setChatMessageText(e.target.value)}
                    placeholder="Enter status notice (e.g. Baltimore County filing submitted via MDEC...)"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 font-sans focus:outline-none focus:border-teal-500"
                  />
                  <button
                    onClick={promptPostChatMessage}
                    disabled={!chatMessageText.trim() || !selectedChatSpace || isLoading}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post to Google Chat</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FIRESTORE AUDIT LEDGER */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">
                  Google Cloud Firestore — Real-Time Activity Audit Trail
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                Collection: workspace_activity
              </span>
            </div>

            {activities.length === 0 ? (
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center text-xs text-slate-500">
                No Workspace activities logged in Firestore yet. Execute a Drive, Sheets, or Gmail action above to see real-time database synchronization.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-800">
                  <thead>
                    <tr className="bg-slate-950 text-slate-300">
                      <th className="p-2">Service</th>
                      <th className="p-2">Action</th>
                      <th className="p-2">Target Resource</th>
                      <th className="p-2">Timestamp</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                    {activities.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-800/40">
                        <td className="p-2 font-bold uppercase text-blue-400">{act.service}</td>
                        <td className="p-2 text-slate-200">{act.action}</td>
                        <td className="p-2 text-slate-400 truncate max-w-xs">{act.resourceTitle}</td>
                        <td className="p-2 text-slate-500">{typeof act.timestamp === 'string' ? act.timestamp.replace('T', ' ').slice(0, 19) : 'Recent'}</td>
                        <td className="p-2 text-emerald-400 font-semibold">{act.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MANDATORY USER CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">{confirmModal.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">Google Workspace User Confirmation</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
              {confirmModal.description}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors shadow cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Confirm &amp; Proceed</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
