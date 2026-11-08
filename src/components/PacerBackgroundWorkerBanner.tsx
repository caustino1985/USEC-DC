import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  BellOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  ExternalLink, 
  Scale, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Volume2, 
  Play, 
  Pause, 
  Sliders, 
  Check, 
  FileText,
  Activity,
  History
} from 'lucide-react';
import { 
  pacerWorker, 
  WorkerState, 
  DocketStatusChangeEvent 
} from '../services/pacerNotificationService';
import { CaseHistoryRecord } from '../types/document';

interface Props {
  onSelectDocket?: (docketNumber: string) => void;
  onDocketsUpdated?: (dockets: CaseHistoryRecord[]) => void;
}

export const PacerBackgroundWorkerBanner: React.FC<Props> = ({
  onSelectDocket,
  onDocketsUpdated
}) => {
  const [workerState, setWorkerState] = useState<WorkerState>(pacerWorker.getState());
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [latestToastEvent, setLatestToastEvent] = useState<DocketStatusChangeEvent | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  const onDocketsUpdatedRef = React.useRef(onDocketsUpdated);
  onDocketsUpdatedRef.current = onDocketsUpdated;

  useEffect(() => {
    let lastCheckCount = workerState.checkCount;
    let lastAlertId: string | null = workerState.recentAlerts.length > 0 ? workerState.recentAlerts[0].id : null;

    const unsubscribe = pacerWorker.subscribe((state) => {
      setWorkerState(state);

      // Only notify parent when a check was performed or dockets actually changed
      if (state.checkCount > lastCheckCount) {
        lastCheckCount = state.checkCount;
        if (onDocketsUpdatedRef.current) {
          onDocketsUpdatedRef.current(pacerWorker.getDocketsList());
        }
      }

      // Only trigger toast if a brand new alert has arrived
      if (state.recentAlerts.length > 0) {
        const top = state.recentAlerts[0];
        if (top.id !== lastAlertId) {
          lastAlertId = top.id;
          setLatestToastEvent(top);
          setIsToastVisible(true);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRequestPermission = async () => {
    const perm = await pacerWorker.requestNotificationPermission();
    if (perm === 'granted') {
      pacerWorker.triggerBrowserNotification(
        '🏛️ Browser Alerts Enabled',
        'You will now receive native desktop alerts whenever a PACER or State Court docket status change is detected.',
        'TEST'
      );
    }
  };

  const handleTestNotification = () => {
    pacerWorker.triggerBrowserNotification(
      '🏛️ PACER Alert Test: Case No. C-03-CV-26-004128',
      'Test notification: Circuit Court for Baltimore County Docket Active. Browser alerts functioning properly!',
      'TEST-4128'
    );
  };

  const handleForceCheck = async () => {
    const changes = await pacerWorker.checkDockets(true);
    if (changes.length > 0) {
      setLatestToastEvent(changes[0]);
      setIsToastVisible(true);
    }
  };

  return (
    <div className="space-y-3">
      {/* Worker Control Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status info */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="relative shrink-0 mt-0.5 sm:mt-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                workerState.isActive
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}>
                {workerState.isActive ? <Radio className="w-5 h-5 animate-pulse text-emerald-400" /> : <Pause className="w-5 h-5" />}
              </div>
              {workerState.isActive && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping" />
              )}
            </div>

            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>PACER Docket Background Worker</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded border ${
                    workerState.isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {workerState.isActive ? 'ACTIVE POLLING' : 'PAUSED'}
                  </span>
                </span>
                <span className="text-slate-500 text-xs hidden sm:inline">•</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {workerState.monitoredDocketsCount} Linked Dockets
                </span>
                <span className="text-slate-500 text-xs hidden sm:inline">•</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Interval: <strong className="text-indigo-300">{workerState.intervalSeconds}s</strong>
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                Continuous background monitor polling federal RECAP &amp; Maryland MDEC dockets for minute orders, status changes, and calendar orders.
              </p>
            </div>
          </div>

          {/* Action buttons & Notification toggle */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Notification Permission Pill */}
            {workerState.notificationPermission === 'granted' ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                <BellRing className="w-3.5 h-3.5 text-emerald-400" />
                <span>Browser Alerts: Active</span>
              </div>
            ) : workerState.notificationPermission === 'denied' ? (
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-medium"
                title="Notifications blocked in browser permissions"
              >
                <BellOff className="w-3.5 h-3.5 text-red-400" />
                <span>Alerts Blocked</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-900/40 transition-colors cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Enable Browser Alerts</span>
              </button>
            )}

            {/* Test alert */}
            <button
              type="button"
              onClick={handleTestNotification}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Test native HTML5 browser alert"
            >
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Test Alert</span>
            </button>

            {/* Force check / Simulate live docket change */}
            <button
              type="button"
              onClick={handleForceCheck}
              disabled={workerState.isCheckingNow}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-900/30 transition-colors cursor-pointer disabled:opacity-50"
              title="Query dockets now or simulate status transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${workerState.isCheckingNow ? 'animate-spin' : ''}`} />
              <span>{workerState.isCheckingNow ? 'Checking...' : 'Check / Simulate Update'}</span>
            </button>

            {/* Interval selection */}
            <select
              value={workerState.intervalSeconds}
              onChange={(e) => pacerWorker.setIntervalSeconds(parseInt(e.target.value, 10))}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono cursor-pointer"
              title="Set background polling interval"
            >
              <option value={15}>Every 15s</option>
              <option value={30}>Every 30s</option>
              <option value={60}>Every 60s</option>
              <option value={120}>Every 2m</option>
            </select>

            {/* Pause / Resume */}
            <button
              type="button"
              onClick={() => workerState.isActive ? pacerWorker.pauseWorker() : pacerWorker.startWorker()}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                workerState.isActive
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
              }`}
              title={workerState.isActive ? 'Pause background worker' : 'Resume background worker'}
            >
              {workerState.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* History Toggle */}
            <button
              type="button"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                isHistoryOpen
                  ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Alerts ({workerState.recentAlerts.length})</span>
            </button>
          </div>
        </div>

        {/* Worker Telemetry Sub-bar */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/80 gap-2 font-mono">
          <div className="flex items-center gap-3">
            <span>Last Audit: <strong className="text-emerald-400">{workerState.lastCheckTimestamp || 'Just now'}</strong></span>
            <span>Total Audits Completed: <strong className="text-slate-200">{workerState.checkCount}</strong></span>
          </div>
          <div className="text-slate-400">
            Source Endpoints: Free Law Project CourtListener RECAP • Maryland Judiciary MDEC
          </div>
        </div>
      </div>

      {/* Floating In-App Status Notification Toast Banner */}
      {isToastVisible && latestToastEvent && (
        <div className="p-3.5 bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/90 border border-amber-500/50 rounded-xl shadow-2xl flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <Scale className="w-4 h-4 text-amber-400" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {latestToastEvent.docketNumber}
                </span>
                <span className="text-xs font-bold text-white">
                  PACER Status Change Detected
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {latestToastEvent.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-medium">
                New Status: <strong className="text-emerald-300">&ldquo;{latestToastEvent.newStatus}&rdquo;</strong>
              </p>
              {latestToastEvent.newEntry && (
                <div className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded border border-slate-800">
                  <span className="font-mono text-indigo-300 font-bold mr-1.5">{latestToastEvent.newEntry.documentNumber}:</span>
                  {latestToastEvent.newEntry.description}
                </div>
              )}
              {latestToastEvent.actionRequired && (
                <div className="text-[10px] text-amber-300/90">
                  <strong>Recommended Action:</strong> {latestToastEvent.actionRequired}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onSelectDocket && (
              <button
                type="button"
                onClick={() => {
                  onSelectDocket(latestToastEvent.docketNumber);
                  setIsToastVisible(false);
                }}
                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
              >
                Inspect
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsToastVisible(false)}
              className="text-slate-400 hover:text-white text-sm p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Expandable Alert History Log */}
      {isHistoryOpen && (
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              <span>PACER Background Worker Detection History</span>
            </h4>
            {workerState.recentAlerts.length > 0 && (
              <button
                type="button"
                onClick={() => pacerWorker.clearAlerts()}
                className="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Clear History
              </button>
            )}
          </div>

          {workerState.recentAlerts.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">
              No status changes detected yet in this session. The background worker will record updates and dispatch browser notifications as new minute orders or docket filings are published.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {workerState.recentAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className="p-3 bg-slate-900 rounded-lg border border-slate-800/80 hover:border-slate-700 transition-colors text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-300 bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-500/30 text-[10px]">
                        {alert.docketNumber}
                      </span>
                      <span className="text-slate-300 font-semibold">{alert.court}</span>
                    </div>
                    <span className="font-mono text-slate-500 text-[10px]">{alert.timestamp}</span>
                  </div>

                  <div className="text-slate-300">
                    <span className="text-slate-500 mr-1">Status:</span>
                    <span className="line-through text-slate-500 mr-1.5 text-[11px]">{alert.previousStatus}</span>
                    <span className="text-emerald-400 font-semibold text-xs">→ {alert.newStatus}</span>
                  </div>

                  {alert.newEntry && (
                    <div className="text-[11px] text-slate-400 bg-slate-950 p-1.5 rounded border border-slate-800">
                      <strong className="text-amber-300">{alert.newEntry.documentNumber}:</strong> {alert.newEntry.description}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                    <span>Source: {alert.source}</span>
                    {alert.url && (
                      <a
                        href={alert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 underline"
                      >
                        <span>Open Docket in RECAP</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
