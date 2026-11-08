import React, { useState } from 'react';
import { 
  Calendar, 
  Video, 
  Send, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ExternalLink, 
  Filter, 
  Sparkles, 
  Gavel, 
  Building2, 
  ShieldCheck, 
  FileText, 
  RefreshCw,
  Mail,
  Zap,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  MASTER_PLEADING_MILESTONES, 
  MasterPleadingMilestone, 
  CourtAttendee 
} from '../data/courtSchedulingData';
import { CourtCalendarEvent } from '../services/googleWorkspaceService';

interface Props {
  token: string | null;
  userEmail?: string | null;
  isLoading: boolean;
  onScheduleMilestone: (event: CourtCalendarEvent, milestoneTitle: string) => Promise<void>;
  onBatchScheduleAll: (events: { event: CourtCalendarEvent; milestoneTitle: string }[]) => Promise<void>;
  onRefreshCalendar: () => Promise<void>;
  existingEvents: any[];
}

export const CourtSchedulingPanel: React.FC<Props> = ({
  token,
  userEmail,
  isLoading,
  onScheduleMilestone,
  onBatchScheduleAll,
  onRefreshCalendar,
  existingEvents
}) => {
  const [filterJurisdiction, setFilterJurisdiction] = useState<'all' | 'state' | 'federal' | 'trust' | 'agency'>('all');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  
  // Custom attendees and time edits mapped by milestone ID
  const [milestoneEdits, setMilestoneEdits] = useState<{
    [id: string]: {
      date: string;
      durationMinutes: number;
      includeMeet: boolean;
      selectedAttendees: string[]; // array of emails
      customAttendeeInput: string;
      customNotes: string;
    }
  }>({});

  // Ad-hoc new court milestone modal
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [customMilestone, setCustomMilestone] = useState<{
    title: string;
    docketNumber: string;
    courtName: string;
    location: string;
    date: string;
    durationMinutes: number;
    description: string;
    attendees: string;
    includeMeet: boolean;
  }>({
    title: 'Emergency Case Management & Docket Conference',
    docketNumber: 'Case No. C-03-CV-26-004128',
    courtName: 'Circuit Court for Baltimore County, Maryland',
    location: '401 Bosley Ave, Towson, MD 21204',
    date: '2026-11-20T10:00',
    durationMinutes: 60,
    description: 'Supplemental case status review and CUSIP custody stipulation.',
    attendees: 'bizcaustin@gmail.com, trustees@psdlef.org',
    includeMeet: true
  });

  // Track scheduled milestone IDs in current session for immediate visual feedback
  const [syncedMilestoneIds, setSyncedMilestoneIds] = useState<Set<string>>(new Set());

  // Get current editing state for a milestone
  const getMilestoneEditState = (m: MasterPleadingMilestone) => {
    if (milestoneEdits[m.id]) return milestoneEdits[m.id];
    return {
      date: m.scheduledDate.slice(0, 16),
      durationMinutes: m.durationMinutes,
      includeMeet: true,
      selectedAttendees: m.defaultAttendees.filter(a => a.selectedByDefault).map(a => a.email),
      customAttendeeInput: '',
      customNotes: ''
    };
  };

  const updateMilestoneEditState = (id: string, updates: Partial<ReturnType<typeof getMilestoneEditState>>) => {
    setMilestoneEdits(prev => {
      const current = prev[id] || {
        date: MASTER_PLEADING_MILESTONES.find(m => m.id === id)?.scheduledDate.slice(0, 16) || '',
        durationMinutes: MASTER_PLEADING_MILESTONES.find(m => m.id === id)?.durationMinutes || 60,
        includeMeet: true,
        selectedAttendees: MASTER_PLEADING_MILESTONES.find(m => m.id === id)?.defaultAttendees.filter(a => a.selectedByDefault).map(a => a.email) || [],
        customAttendeeInput: '',
        customNotes: ''
      };
      return {
        ...prev,
        [id]: { ...current, ...updates }
      };
    });
  };

  // Check if a milestone has already been synced to Google Calendar (by summary comparison or session state)
  const isMilestoneSynced = (m: MasterPleadingMilestone) => {
    if (syncedMilestoneIds.has(m.id)) return true;
    return existingEvents.some(ev => {
      const summary = (ev.summary || '').toLowerCase();
      return summary.includes(m.docketNumber.toLowerCase()) || 
             summary.includes(m.courtName.toLowerCase()) ||
             summary.includes(m.milestoneTitle.toLowerCase().slice(0, 30));
    });
  };

  // Find matching event link if exists
  const getExistingEvent = (m: MasterPleadingMilestone) => {
    return existingEvents.find(ev => {
      const summary = (ev.summary || '').toLowerCase();
      return summary.includes(m.docketNumber.toLowerCase()) || 
             summary.includes(m.courtName.toLowerCase()) ||
             summary.includes(m.milestoneTitle.toLowerCase().slice(0, 30));
    });
  };

  // Filtered milestones
  const filteredMilestones = MASTER_PLEADING_MILESTONES.filter(m => {
    if (filterJurisdiction === 'all') return true;
    return m.jurisdiction === filterJurisdiction;
  });

  // Schedule a single milestone with Google Calendar invitation
  const handleTriggerScheduleMilestone = async (m: MasterPleadingMilestone) => {
    const edit = getMilestoneEditState(m);
    const startDate = new Date(edit.date);
    const endDate = new Date(startDate.getTime() + edit.durationMinutes * 60000);

    // Combine default selected attendees with any custom typed attendees
    const attendeeEmails = new Set(edit.selectedAttendees);
    if (edit.customAttendeeInput.trim()) {
      edit.customAttendeeInput.split(/[,;\s]+/).forEach(email => {
        if (email.includes('@')) attendeeEmails.add(email.trim());
      });
    }

    const attendeeList = Array.from(attendeeEmails).map(email => {
      const found = m.defaultAttendees.find(a => a.email === email);
      return {
        email,
        displayName: found ? found.displayName : undefined
      };
    });

    const eventPayload: CourtCalendarEvent = {
      summary: `${m.milestoneTitle} (${m.docketNumber})`,
      description: `${m.description}

Statutory Authority: ${m.statutoryBasis}
Pleading Reference: ${m.instrumentPart}
Action Demanded: ${m.actionRequested}
${edit.customNotes ? `\nAdditional Case Notes: ${edit.customNotes}` : ''}

Generated via Google Workspace Legal Hub for Case C-03-CV-26-004128.`,
      location: m.location,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      createMeetRoom: edit.includeMeet,
      attendees: attendeeList,
      sendUpdates: 'all' // Dispatches Google Calendar email invitations
    };

    await onScheduleMilestone(eventPayload, m.milestoneTitle);
    setSyncedMilestoneIds(prev => new Set([...prev, m.id]));
  };

  // 1-Click Batch Schedule All Milestones
  const handleBatchScheduleAll = async () => {
    const batchPayload = filteredMilestones.map(m => {
      const edit = getMilestoneEditState(m);
      const startDate = new Date(edit.date);
      const endDate = new Date(startDate.getTime() + edit.durationMinutes * 60000);

      const attendeeEmails = new Set(edit.selectedAttendees);
      if (edit.customAttendeeInput.trim()) {
        edit.customAttendeeInput.split(/[,;\s]+/).forEach(email => {
          if (email.includes('@')) attendeeEmails.add(email.trim());
        });
      }

      const attendeeList = Array.from(attendeeEmails).map(email => {
        const found = m.defaultAttendees.find(a => a.email === email);
        return {
          email,
          displayName: found ? found.displayName : undefined
        };
      });

      const eventPayload: CourtCalendarEvent = {
        summary: `${m.milestoneTitle} (${m.docketNumber})`,
        description: `${m.description}\n\nStatutory Basis: ${m.statutoryBasis}\nAction: ${m.actionRequested}`,
        location: m.location,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        createMeetRoom: true,
        attendees: attendeeList,
        sendUpdates: 'all'
      };

      return {
        event: eventPayload,
        milestoneTitle: m.milestoneTitle
      };
    });

    await onBatchScheduleAll(batchPayload);
    setSyncedMilestoneIds(prev => new Set([...prev, ...filteredMilestones.map(m => m.id)]));
  };

  // Schedule Custom Ad-Hoc Hearing
  const handleSaveCustomMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    const startDate = new Date(customMilestone.date);
    const endDate = new Date(startDate.getTime() + customMilestone.durationMinutes * 60000);

    const attendees = customMilestone.attendees
      .split(/[,;\s]+/)
      .filter(em => em.includes('@'))
      .map(email => ({ email: email.trim() }));

    const eventPayload: CourtCalendarEvent = {
      summary: `${customMilestone.title} (${customMilestone.docketNumber})`,
      description: `${customMilestone.description}\nCourt: ${customMilestone.courtName}`,
      location: customMilestone.location,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      createMeetRoom: customMilestone.includeMeet,
      attendees,
      sendUpdates: 'all'
    };

    await onScheduleMilestone(eventPayload, customMilestone.title);
    setIsCustomModalOpen(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
      {/* Header and Hero Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              DIRECT MASTER PLEADING SYNCHRONIZATION
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">
              Google Calendar API v3 + Meet + Attendee Invites
            </span>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>Court Scheduling &amp; Appearance Invitation Hub</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Synchronizes scheduled appearance dates, show-cause orders, Rule 18 conferences, and directed trust convenings directly with Google Calendar. Automatically generates and dispatches official Google Calendar invites with video conference links (Google Meet) to all named co-trustees, depository bank representatives, and court clerks.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onRefreshCalendar}
            disabled={isLoading || !token}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer border border-slate-700"
            title="Refresh events from your Google Calendar"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Calendar</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCustomModalOpen(true)}
            disabled={isLoading || !token}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-amber-500/40"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Custom Docket Date</span>
          </button>

          <button
            type="button"
            onClick={handleBatchScheduleAll}
            disabled={isLoading || !token}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 via-indigo-600 to-emerald-600 hover:brightness-110 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-900/40 cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 text-amber-200" />
            <span>⚡ 1-Click Sync All Court Dates ({filteredMilestones.length})</span>
          </button>
        </div>
      </div>

      {/* Jurisdiction Filters & Overview Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-500" />
            <span>Jurisdiction:</span>
          </span>
          {[
            { id: 'all', label: 'All Dockets (6)' },
            { id: 'state', label: 'Baltimore County (3)' },
            { id: 'federal', label: 'D.C. Circuit (1)' },
            { id: 'trust', label: 'Wyoming Trust (1)' },
            { id: 'agency', label: 'SSA OHO (1)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterJurisdiction(tab.id as any)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filterJurisdiction === tab.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Synced to Calendar: {MASTER_PLEADING_MILESTONES.filter(isMilestoneSynced).length} / {MASTER_PLEADING_MILESTONES.length}</span>
          </span>
        </div>
      </div>

      {/* Milestones Cards List */}
      <div className="space-y-4">
        {filteredMilestones.map((m) => {
          const isSynced = isMilestoneSynced(m);
          const existing = getExistingEvent(m);
          const edit = getMilestoneEditState(m);
          const isExpanded = selectedMilestoneId === m.id;
          const meetUrl = existing?.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video')?.uri;

          return (
            <div 
              key={m.id} 
              className={`bg-slate-950 rounded-xl border transition-all ${
                isSynced 
                  ? 'border-emerald-500/40 shadow-sm shadow-emerald-950/20' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {m.docketNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        m.jurisdiction === 'state'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : m.jurisdiction === 'federal'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : m.jurisdiction === 'trust'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {m.jurisdictionLabel}
                      </span>
                      {isSynced && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Synced to Google Calendar</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white leading-snug">
                      {m.milestoneTitle}
                    </h4>

                    <div className="text-xs text-indigo-300 font-medium">
                      {m.instrumentPart}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>
                          {new Date(edit.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })} at {new Date(edit.date).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                          })} ({edit.durationMinutes} min)
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        <span className="truncate max-w-sm">{m.location}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        <span>{edit.selectedAttendees.length} Invitees</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap lg:flex-col items-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTriggerScheduleMilestone(m)}
                      disabled={isLoading || !token}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-amber-900/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSynced ? 'Re-send / Update Invite' : 'Send Calendar Invitation'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMilestoneId(isExpanded ? null : m.id)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Details & Invitees' : 'Customize Attendees & Notes'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {meetUrl && (
                      <a
                        href={meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 underline pt-0.5"
                      >
                        <Video className="w-3 h-3" />
                        <span>Join Google Meet</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Statutory Basis & Action Demanded Pill */}
                <div className="mt-3 pt-3 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
                  <div>
                    <strong className="text-slate-300">Statutory Authority:</strong> {m.statutoryBasis}
                  </div>
                  <div className="text-amber-300/90 font-mono">
                    <strong>Action:</strong> {m.actionRequested.slice(0, 95)}...
                  </div>
                </div>
              </div>

              {/* Expandable Customization Panel */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-800 bg-slate-900/60 rounded-b-xl space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Time & Duration Configuration */}
                    <div className="space-y-3 bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
                      <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 flex items-center justify-between">
                        <span>Event Date, Time &amp; Video Bridge</span>
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">Scheduled Date &amp; Time:</label>
                          <input
                            type="datetime-local"
                            value={edit.date}
                            onChange={(e) => updateMilestoneEditState(m.id, { date: e.target.value })}
                            className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-100 font-mono text-xs focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Duration (Minutes):</label>
                          <select
                            value={edit.durationMinutes}
                            onChange={(e) => updateMilestoneEditState(m.id, { durationMinutes: parseInt(e.target.value, 10) })}
                            className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-100 text-xs focus:ring-1 focus:ring-amber-500"
                          >
                            <option value={30}>30 Minutes</option>
                            <option value={45}>45 Minutes</option>
                            <option value={60}>60 Minutes (1 Hour)</option>
                            <option value={90}>90 Minutes (1.5 Hours)</option>
                            <option value={120}>120 Minutes (2 Hours)</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                          <input
                            type="checkbox"
                            checked={edit.includeMeet}
                            onChange={(e) => updateMilestoneEditState(m.id, { includeMeet: e.target.checked })}
                            className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900"
                          />
                          <span className="flex items-center gap-1.5 font-semibold">
                            <Video className="w-3.5 h-3.5 text-blue-400" />
                            <span>Generate Active Google Meet Video Conference Room</span>
                          </span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Supplemental Fiduciary Notes:</label>
                        <textarea
                          rows={2}
                          value={edit.customNotes}
                          onChange={(e) => updateMilestoneEditState(m.id, { customNotes: e.target.value })}
                          placeholder="Add special instructions, docket references, or dial-in notes..."
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-200 placeholder-slate-500 text-xs focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Attendee Selection & Email Invites */}
                    <div className="space-y-3 bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
                      <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 flex items-center justify-between">
                        <span>Named Parties &amp; Calendar Invitees</span>
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                      </div>

                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {m.defaultAttendees.map((att) => {
                          const isSelected = edit.selectedAttendees.includes(att.email);
                          return (
                            <label 
                              key={att.email} 
                              className={`flex items-start gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                                isSelected ? 'bg-indigo-950/40 text-slate-200' : 'text-slate-400 hover:bg-slate-900'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    updateMilestoneEditState(m.id, {
                                      selectedAttendees: [...edit.selectedAttendees, att.email]
                                    });
                                  } else {
                                    updateMilestoneEditState(m.id, {
                                      selectedAttendees: edit.selectedAttendees.filter(em => em !== att.email)
                                    });
                                  }
                                }}
                                className="mt-0.5 rounded border-slate-700 text-indigo-500 bg-slate-900"
                              />
                              <div className="flex-1">
                                <div className="font-semibold text-[11px] text-slate-200">{att.displayName}</div>
                                <div className="text-[10px] text-slate-400 font-mono truncate">{att.email}</div>
                                <div className="text-[9px] text-indigo-400">{att.role}</div>
                              </div>
                            </label>
                          );
                        })}
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Add Additional Invitee Emails (comma separated):</label>
                        <input
                          type="text"
                          value={edit.customAttendeeInput}
                          onChange={(e) => updateMilestoneEditState(m.id, { customAttendeeInput: e.target.value })}
                          placeholder="e.g. associate@firm.com, clerk@courts.state.md.us"
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 text-xs placeholder-slate-500 font-mono focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Single milestone save/send button */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleTriggerScheduleMilestone(m)}
                      disabled={isLoading || !token}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Confirm &amp; Send Calendar Invitations to {edit.selectedAttendees.length} Parties</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Docket Date Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Schedule Custom Court Date</span>
              </h4>
              <button 
                type="button" 
                onClick={() => setIsCustomModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveCustomMilestone} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Hearing / Conference Title:</label>
                <input
                  type="text"
                  value={customMilestone.title}
                  onChange={(e) => setCustomMilestone({ ...customMilestone, title: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Docket / Case Number:</label>
                  <input
                    type="text"
                    value={customMilestone.docketNumber}
                    onChange={(e) => setCustomMilestone({ ...customMilestone, docketNumber: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Court / Agency Venue:</label>
                  <input
                    type="text"
                    value={customMilestone.courtName}
                    onChange={(e) => setCustomMilestone({ ...customMilestone, courtName: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Date &amp; Start Time:</label>
                  <input
                    type="datetime-local"
                    value={customMilestone.date}
                    onChange={(e) => setCustomMilestone({ ...customMilestone, date: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Duration (Minutes):</label>
                  <select
                    value={customMilestone.durationMinutes}
                    onChange={(e) => setCustomMilestone({ ...customMilestone, durationMinutes: parseInt(e.target.value, 10) })}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white"
                  >
                    <option value={30}>30 min</option>
                    <option value={60}>60 min (1 hr)</option>
                    <option value={90}>90 min (1.5 hr)</option>
                    <option value={120}>120 min (2 hr)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Physical Location or Remote Bridge:</label>
                <input
                  type="text"
                  value={customMilestone.location}
                  onChange={(e) => setCustomMilestone({ ...customMilestone, location: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Invitee Emails (comma-separated):</label>
                <input
                  type="text"
                  value={customMilestone.attendees}
                  onChange={(e) => setCustomMilestone({ ...customMilestone, attendees: e.target.value })}
                  placeholder="lawyer@example.com, clerk@courts.state.md.us"
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customMilestone.includeMeet}
                    onChange={(e) => setCustomMilestone({ ...customMilestone, includeMeet: e.target.checked })}
                    className="rounded border-slate-700 text-amber-500 bg-slate-950"
                  />
                  <span>Create Google Meet Video Conference Room</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded text-xs shadow flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Schedule &amp; Send Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
