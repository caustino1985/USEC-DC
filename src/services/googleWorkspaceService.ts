/**
 * Client-Side Google Workspace API Service
 * Interacts directly with Google Drive, Sheets, Gmail, Calendar, Docs, Chat, and Meet.
 * Strictly adheres to client-side OAuth Bearer token patterns and mandatory user confirmation for mutations.
 */

// --- GOOGLE DRIVE ---
export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  webViewLink?: string;
  size?: string;
}

export async function listDriveFiles(accessToken: string): Promise<DriveFileItem[]> {
  const query = encodeURIComponent("trashed = false");
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,modifiedTime,webViewLink,size)&pageSize=25`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Google Drive list failed: ${res.statusText}`);
  }
  const data = await res.json();
  return data.files || [];
}

export async function uploadLegalFileToDrive(
  accessToken: string,
  fileName: string,
  content: string,
  mimeType: string = 'text/plain'
): Promise<DriveFileItem> {
  const metadata = {
    name: fileName,
    mimeType: mimeType,
    description: 'Master Legal Filing Instrument (Baltimore County Circuit Court & Federal Dockets)'
  };

  const boundary = 'foo_bar_baz';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n` +
    content +
    closeDelimiter;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: multipartRequestBody
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Google Drive upload failed: ${res.statusText}`);
  }
  return res.json();
}

// --- GOOGLE SHEETS ---
export interface SheetCreationResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

export async function createPortfolioSheet(
  accessToken: string,
  title: string,
  rows: (string | number)[][]
): Promise<SheetCreationResult> {
  // Step 1: Create Spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: title
      }
    })
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || `Google Sheets creation failed: ${createRes.statusText}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  // Step 2: Populate rows if provided
  if (rows && rows.length > 0) {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: rows
      })
    });
  }

  return {
    spreadsheetId,
    spreadsheetUrl,
    title
  };
}

// --- GMAIL ---
export interface EmailPayload {
  to: string;
  cc?: string;
  subject: string;
  body: string;
}

function makeRawEmail(to: string, cc: string | undefined, subject: string, body: string): string {
  const str = [
    `To: ${to}`,
    cc ? `Cc: ${cc}` : '',
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    '',
    body
  ].filter(line => line !== '').join('\r\n');

  // base64url encode
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function sendLegalEmail(accessToken: string, payload: EmailPayload): Promise<{ id: string; threadId: string }> {
  const raw = makeRawEmail(payload.to, payload.cc, payload.subject, payload.body);
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gmail send failed: ${res.statusText}`);
  }
  return res.json();
}

export async function createGmailDraft(accessToken: string, payload: EmailPayload): Promise<{ id: string }> {
  const raw = makeRawEmail(payload.to, payload.cc, payload.subject, payload.body);
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: { raw } })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gmail draft creation failed: ${res.statusText}`);
  }
  return res.json();
}

// --- GOOGLE CALENDAR & MEET ---
export interface CourtCalendarEvent {
  summary: string;
  description: string;
  location?: string;
  startTime: string; // ISO format
  endTime: string;   // ISO format
  createMeetRoom?: boolean;
}

export async function listCalendarEvents(accessToken: string): Promise<any[]> {
  const now = new Date().toISOString();
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&maxResults=15&singleEvents=true&orderBy=startTime`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Calendar events fetch failed: ${res.statusText}`);
  }
  const data = await res.json();
  return data.items || [];
}

export async function scheduleCourtEvent(accessToken: string, event: CourtCalendarEvent): Promise<any> {
  const eventBody: any = {
    summary: event.summary,
    description: event.description,
    location: event.location || 'Circuit Court for Baltimore County, Towson, MD 21204',
    start: { dateTime: event.startTime },
    end: { dateTime: event.endTime }
  };

  if (event.createMeetRoom) {
    eventBody.conferenceData = {
      createRequest: {
        requestId: `meet_${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    };
  }

  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events${event.createMeetRoom ? '?conferenceDataVersion=1' : ''}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventBody)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Google Calendar event creation failed: ${res.statusText}`);
  }
  return res.json();
}

// --- GOOGLE DOCS ---
export interface DocumentCreationResult {
  documentId: string;
  title: string;
}

export async function createGoogleDoc(accessToken: string, title: string, textContent: string): Promise<DocumentCreationResult> {
  // Step 1: Create document
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || `Google Docs creation failed: ${createRes.statusText}`);
  }

  const docData = await createRes.json();
  const documentId = docData.documentId;

  // Step 2: Insert text content
  if (textContent) {
    await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: textContent
            }
          }
        ]
      })
    });
  }

  return {
    documentId,
    title
  };
}

// --- GOOGLE CHAT ---
export interface ChatSpaceItem {
  name: string;
  displayName?: string;
  type?: string;
}

export async function listChatSpaces(accessToken: string): Promise<ChatSpaceItem[]> {
  const res = await fetch('https://chat.googleapis.com/v1/spaces?pageSize=20', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Google Chat spaces fetch failed: ${res.statusText}`);
  }
  const data = await res.json();
  return data.spaces || [];
}

export async function postChatMessage(accessToken: string, spaceName: string, text: string): Promise<any> {
  const res = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Google Chat message failed: ${res.statusText}`);
  }
  return res.json();
}
