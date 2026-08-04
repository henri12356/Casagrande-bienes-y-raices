"use client";

const DB_NAME = "casagrande-panel-vault";
const DB_VERSION = 1;
const STORE_STATE = "state";
const STORE_SNAPSHOTS = "snapshots";
const STORE_META = "meta";
const STATE_ID = "panel-principal";
const FILE_HANDLE_ID = "archivo-maestro";
const MIRROR_KEY = "casagrande-panel-vault-mirror-v1";
const CHANNEL_NAME = "casagrande-panel-vault-channel-v1";
const SNAPSHOT_LIMIT = 100;

type PermissionStateLike = "granted" | "denied" | "prompt" | "unknown";

type FileSystemWritableLike = {
  write(data: Blob | string): Promise<void>;
  close(): Promise<void>;
};

type FileHandleLike = {
  kind?: "file";
  name: string;
  getFile(): Promise<File>;
  createWritable(): Promise<FileSystemWritableLike>;
  queryPermission?: (options?: { mode?: "read" | "readwrite" }) => Promise<PermissionState>;
  requestPermission?: (options?: { mode?: "read" | "readwrite" }) => Promise<PermissionState>;
};

type FilePickerWindow = Window & {
  showSaveFilePicker?: (options?: {
    suggestedName?: string;
    types?: Array<{
      description?: string;
      accept: Record<string, string[]>;
    }>;
  }) => Promise<FileHandleLike>;
};

export type VaultEnvelope<T> = {
  format: "casagrande-panel-vault";
  schemaVersion: 1;
  revision: number;
  updatedAt: string;
  updatedAtMs: number;
  deviceId: string;
  hash: string;
  data: T;
};

export type VaultSnapshot<T> = {
  id: string;
  createdAt: string;
  createdAtMs: number;
  reason: string;
  revision: number;
  hash: string;
  data: T;
};

export type VaultStatus = {
  indexedDb: boolean;
  persistent: boolean | null;
  saving: boolean;
  lastSavedAt?: string;
  lastError?: string;
  sharedFileSupported: boolean;
  sharedFileName?: string;
  sharedFilePermission: PermissionStateLike;
  lastSharedSyncAt?: string;
};

type LoadOptions<T> = {
  initialData: T;
  legacyKeys?: string[];
};

let databasePromise: Promise<IDBDatabase> | null = null;
let saveQueue: Promise<unknown> = Promise.resolve();

function nowIso() {
  return new Date().toISOString();
}

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getDeviceId() {
  const key = "casagrande-panel-device-id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const id = generateId();
  window.localStorage.setItem(key, id);
  return id;
}

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Error de IndexedDB."));
  });
}

function transactionDone(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () =>
      reject(transaction.error ?? new Error("La transacción fue cancelada."));
    transaction.onerror = () =>
      reject(transaction.error ?? new Error("La transacción falló."));
  });
}

function openDatabase() {
  if (databasePromise) return databasePromise;

  databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_STATE)) {
        database.createObjectStore(STORE_STATE, { keyPath: "id" });
      }

      if (!database.objectStoreNames.contains(STORE_SNAPSHOTS)) {
        const snapshots = database.createObjectStore(STORE_SNAPSHOTS, {
          keyPath: "id",
        });
        snapshots.createIndex("createdAtMs", "createdAtMs");
      }

      if (!database.objectStoreNames.contains(STORE_META)) {
        database.createObjectStore(STORE_META, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("No se pudo abrir IndexedDB."));
  });

  return databasePromise;
}

async function getRecord<T>(storeName: string, key: IDBValidKey) {
  const database = await openDatabase();
  const transaction = database.transaction(storeName, "readonly");
  const request = transaction.objectStore(storeName).get(key);
  const result = await requestToPromise<T | undefined>(request);
  await transactionDone(transaction);
  return result;
}

async function putRecord(storeName: string, value: unknown) {
  const database = await openDatabase();
  const transaction = database.transaction(storeName, "readwrite");
  transaction.objectStore(storeName).put(value);
  await transactionDone(transaction);
}

async function deleteRecord(storeName: string, key: IDBValidKey) {
  const database = await openDatabase();
  const transaction = database.transaction(storeName, "readwrite");
  transaction.objectStore(storeName).delete(key);
  await transactionDone(transaction);
}

async function getAllSnapshots<T>() {
  const database = await openDatabase();
  const transaction = database.transaction(STORE_SNAPSHOTS, "readonly");
  const request = transaction.objectStore(STORE_SNAPSHOTS).getAll();
  const snapshots = await requestToPromise<VaultSnapshot<T>[]>(request);
  await transactionDone(transaction);

  return snapshots.sort((a, b) => b.createdAtMs - a.createdAtMs);
}

async function trimSnapshots() {
  const snapshots = await getAllSnapshots<unknown>();
  const extras = snapshots.slice(SNAPSHOT_LIMIT);

  if (extras.length === 0) return;

  const database = await openDatabase();
  const transaction = database.transaction(STORE_SNAPSHOTS, "readwrite");
  const store = transaction.objectStore(STORE_SNAPSHOTS);
  extras.forEach((snapshot) => store.delete(snapshot.id));
  await transactionDone(transaction);
}

async function sha256(value: unknown) {
  const serialized = JSON.stringify(value);
  const bytes = new TextEncoder().encode(serialized);

  if (!crypto?.subtle) {
    let fallback = 0;
    for (let index = 0; index < serialized.length; index += 1) {
      fallback = (fallback * 31 + serialized.charCodeAt(index)) >>> 0;
    }
    return `fallback-${fallback.toString(16)}`;
  }

  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function isEnvelope<T = unknown>(value: unknown): value is VaultEnvelope<T> {
  if (!value || typeof value !== "object") return false;

  const envelope = value as Partial<VaultEnvelope<T>>;
  return (
    envelope.format === "casagrande-panel-vault" &&
    envelope.schemaVersion === 1 &&
    typeof envelope.revision === "number" &&
    typeof envelope.updatedAt === "string" &&
    typeof envelope.updatedAtMs === "number" &&
    typeof envelope.deviceId === "string" &&
    typeof envelope.hash === "string" &&
    "data" in envelope
  );
}

async function requestPersistentStorage() {
  try {
    if (!navigator.storage?.persist) return null;

    const alreadyPersistent = await navigator.storage.persisted?.();
    if (alreadyPersistent) return true;

    return await navigator.storage.persist();
  } catch {
    return null;
  }
}

async function getSharedHandle() {
  const record = await getRecord<{ id: string; handle: FileHandleLike }>(
    STORE_META,
    FILE_HANDLE_ID,
  );
  return record?.handle;
}

async function getHandlePermission(
  handle: FileHandleLike,
  requestPermission: boolean,
): Promise<PermissionStateLike> {
  try {
    if (!handle.queryPermission) return "granted";

    let permission = await handle.queryPermission({ mode: "readwrite" });

    if (
      permission === "prompt" &&
      requestPermission &&
      handle.requestPermission
    ) {
      permission = await handle.requestPermission({ mode: "readwrite" });
    }

    return permission;
  } catch {
    return "unknown";
  }
}

async function readEnvelopeFromHandle<T>(handle: FileHandleLike) {
  const file = await handle.getFile();
  const content = await file.text();

  if (!content.trim()) return null;

  const parsed: unknown = JSON.parse(content);
  if (!isEnvelope<T>(parsed)) {
    throw new Error(
      "El archivo seleccionado no es un archivo maestro válido del panel.",
    );
  }

  return parsed;
}

async function writeEnvelopeToHandle<T>(
  handle: FileHandleLike,
  envelope: VaultEnvelope<T>,
) {
  const writable = await handle.createWritable();
  await writable.write(
    new Blob([JSON.stringify(envelope, null, 2)], {
      type: "application/json",
    }),
  );
  await writable.close();
}

async function persistEnvelope<T>(
  envelope: VaultEnvelope<T>,
  reason: string,
  createSnapshot = true,
) {
  const database = await openDatabase();
  const storeNames = createSnapshot
    ? [STORE_STATE, STORE_SNAPSHOTS]
    : [STORE_STATE];
  const transaction = database.transaction(storeNames, "readwrite");

  transaction.objectStore(STORE_STATE).put({
    id: STATE_ID,
    envelope,
  });

  if (createSnapshot) {
    const snapshot: VaultSnapshot<T> = {
      id: generateId(),
      createdAt: envelope.updatedAt,
      createdAtMs: envelope.updatedAtMs,
      reason,
      revision: envelope.revision,
      hash: envelope.hash,
      data: envelope.data,
    };
    transaction.objectStore(STORE_SNAPSHOTS).put(snapshot);
  }

  await transactionDone(transaction);

  try {
    window.localStorage.setItem(MIRROR_KEY, JSON.stringify(envelope));
  } catch {
    // IndexedDB continúa siendo la fuente principal.
  }

  if (createSnapshot) {
    await trimSnapshots();
  }
}

function broadcastEnvelope<T>(envelope: VaultEnvelope<T>) {
  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage({
      type: "panel-updated",
      revision: envelope.revision,
      hash: envelope.hash,
    });
    channel.close();
  }

  try {
    window.localStorage.setItem(
      `${MIRROR_KEY}-event`,
      JSON.stringify({
        revision: envelope.revision,
        hash: envelope.hash,
        at: Date.now(),
      }),
    );
  } catch {
    // BroadcastChannel es la vía principal.
  }
}

async function buildEnvelope<T>(
  data: T,
  revision: number,
): Promise<VaultEnvelope<T>> {
  const updatedAtMs = Date.now();

  return {
    format: "casagrande-panel-vault",
    schemaVersion: 1,
    revision,
    updatedAt: new Date(updatedAtMs).toISOString(),
    updatedAtMs,
    deviceId: getDeviceId(),
    hash: await sha256(data),
    data,
  };
}

export async function getCurrentEnvelope<T>() {
  const record = await getRecord<{
    id: string;
    envelope: VaultEnvelope<T>;
  }>(STORE_STATE, STATE_ID);

  return record?.envelope;
}

export async function loadPanelVault<T>({
  initialData,
  legacyKeys = [],
}: LoadOptions<T>) {
  await requestPersistentStorage();

  const localEnvelope = await getCurrentEnvelope<T>();
  const handle = await getSharedHandle();

  let sharedEnvelope: VaultEnvelope<T> | null = null;

  if (handle) {
    const permission = await getHandlePermission(handle, false);
    if (permission === "granted") {
      try {
        sharedEnvelope = await readEnvelopeFromHandle<T>(handle);
      } catch {
        sharedEnvelope = null;
      }
    }
  }

  if (
    sharedEnvelope &&
    (!localEnvelope ||
      sharedEnvelope.updatedAtMs > localEnvelope.updatedAtMs ||
      sharedEnvelope.revision > localEnvelope.revision)
  ) {
    await persistEnvelope(sharedEnvelope, "Sincronización desde archivo maestro");
    return sharedEnvelope;
  }

  if (localEnvelope) {
    return localEnvelope;
  }

  for (const legacyKey of legacyKeys) {
    try {
      const legacyValue = window.localStorage.getItem(legacyKey);
      if (!legacyValue) continue;

      const parsed = JSON.parse(legacyValue) as T;
      const envelope = await buildEnvelope(parsed, 1);
      await persistEnvelope(envelope, `Migración desde ${legacyKey}`);
      return envelope;
    } catch {
      // Continúa con la siguiente clave.
    }
  }

  const envelope = await buildEnvelope(initialData, 1);
  await persistEnvelope(envelope, "Configuración inicial");
  return envelope;
}

export function savePanelVault<T>(data: T, reason = "Guardado automático") {
  saveQueue = saveQueue.then(async () => {
    const current = await getCurrentEnvelope<T>();
    const newHash = await sha256(data);

    if (current?.hash === newHash) {
      return current;
    }

    let highestRevision = current?.revision ?? 0;
    const handle = await getSharedHandle();

    if (handle) {
      const permission = await getHandlePermission(handle, false);
      if (permission === "granted") {
        try {
          const remote = await readEnvelopeFromHandle<T>(handle);
          highestRevision = Math.max(
            highestRevision,
            remote?.revision ?? 0,
          );
        } catch {
          // Si el archivo está vacío o dañado, se escribirá una versión válida.
        }
      }
    }

    const envelope = await buildEnvelope(data, highestRevision + 1);
    await persistEnvelope(envelope, reason);

    if (handle) {
      const permission = await getHandlePermission(handle, false);
      if (permission === "granted") {
        await writeEnvelopeToHandle(handle, envelope);
      }
    }

    broadcastEnvelope(envelope);
    return envelope;
  });

  return saveQueue as Promise<VaultEnvelope<T>>;
}

export function subscribePanelVault<T>(
  callback: (envelope: VaultEnvelope<T>) => void,
) {
  const channel =
    "BroadcastChannel" in window
      ? new BroadcastChannel(CHANNEL_NAME)
      : null;

  const reload = async () => {
    const envelope = await getCurrentEnvelope<T>();
    if (envelope) callback(envelope);
  };

  if (channel) {
    channel.onmessage = () => {
      void reload();
    };
  }

  const handleStorage = (event: StorageEvent) => {
    if (
      event.key === MIRROR_KEY ||
      event.key === `${MIRROR_KEY}-event`
    ) {
      void reload();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    channel?.close();
    window.removeEventListener("storage", handleStorage);
  };
}

export async function connectSharedMasterFile<T>(currentData: T) {
  const pickerWindow = window as FilePickerWindow;

  if (!pickerWindow.showSaveFilePicker) {
    throw new Error(
      "Este navegador no permite conectar un archivo maestro directamente.",
    );
  }

  const handle = await pickerWindow.showSaveFilePicker({
    suggestedName: "casagrande-panel-maestro.json",
    types: [
      {
        description: "Archivo maestro Casagrande",
        accept: {
          "application/json": [".json"],
        },
      },
    ],
  });

  const permission = await getHandlePermission(handle, true);
  if (permission !== "granted") {
    throw new Error("No se concedió permiso para escribir el archivo.");
  }

  await putRecord(STORE_META, {
    id: FILE_HANDLE_ID,
    handle,
  });

  const localEnvelope =
    (await getCurrentEnvelope<T>()) ?? (await buildEnvelope(currentData, 1));

  let remoteEnvelope: VaultEnvelope<T> | null = null;

  try {
    remoteEnvelope = await readEnvelopeFromHandle<T>(handle);
  } catch {
    remoteEnvelope = null;
  }

  if (
    remoteEnvelope &&
    (remoteEnvelope.updatedAtMs > localEnvelope.updatedAtMs ||
      remoteEnvelope.revision > localEnvelope.revision)
  ) {
    await persistEnvelope(
      remoteEnvelope,
      "Archivo maestro conectado: se importó una versión más reciente",
    );
    broadcastEnvelope(remoteEnvelope);
    return remoteEnvelope;
  }

  await writeEnvelopeToHandle(handle, localEnvelope);
  return localEnvelope;
}

export async function syncSharedMasterFile<T>(requestPermission = false) {
  const handle = await getSharedHandle();
  if (!handle) return null;

  const permission = await getHandlePermission(handle, requestPermission);
  if (permission !== "granted") {
    throw new Error(
      "El archivo maestro necesita permiso para leer y escribir.",
    );
  }

  const localEnvelope = await getCurrentEnvelope<T>();
  let remoteEnvelope: VaultEnvelope<T> | null = null;

  try {
    remoteEnvelope = await readEnvelopeFromHandle<T>(handle);
  } catch {
    remoteEnvelope = null;
  }

  if (!localEnvelope && remoteEnvelope) {
    await persistEnvelope(remoteEnvelope, "Sincronización desde archivo maestro");
    broadcastEnvelope(remoteEnvelope);
    return remoteEnvelope;
  }

  if (!localEnvelope) return null;

  if (
    remoteEnvelope &&
    remoteEnvelope.hash !== localEnvelope.hash &&
    (remoteEnvelope.updatedAtMs > localEnvelope.updatedAtMs ||
      remoteEnvelope.revision > localEnvelope.revision)
  ) {
    await persistEnvelope(
      remoteEnvelope,
      "Sincronización: se recibió una versión más reciente",
    );
    broadcastEnvelope(remoteEnvelope);
    return remoteEnvelope;
  }

  if (!remoteEnvelope || remoteEnvelope.hash !== localEnvelope.hash) {
    await writeEnvelopeToHandle(handle, localEnvelope);
  }

  return localEnvelope;
}

export async function disconnectSharedMasterFile() {
  await deleteRecord(STORE_META, FILE_HANDLE_ID);
}

export async function getPanelVaultStatus(): Promise<VaultStatus> {
  let indexedDb = true;

  try {
    await openDatabase();
  } catch {
    indexedDb = false;
  }

  let persistent: boolean | null = null;
  try {
    persistent = navigator.storage?.persisted
      ? await navigator.storage.persisted()
      : null;
  } catch {
    persistent = null;
  }

  const handle = await getSharedHandle();
  const sharedFilePermission = handle
    ? await getHandlePermission(handle, false)
    : "unknown";

  const current = await getCurrentEnvelope<unknown>();

  return {
    indexedDb,
    persistent,
    saving: false,
    lastSavedAt: current?.updatedAt,
    sharedFileSupported:
      typeof (window as FilePickerWindow).showSaveFilePicker === "function",
    sharedFileName: handle?.name,
    sharedFilePermission,
  };
}

export async function restorePreviousSnapshot<T>() {
  const current = await getCurrentEnvelope<T>();
  const snapshots = await getAllSnapshots<T>();

  const previous = snapshots.find(
    (snapshot) => snapshot.hash !== current?.hash,
  );

  if (!previous) return null;

  const envelope = await buildEnvelope(
    previous.data,
    (current?.revision ?? previous.revision) + 1,
  );

  await persistEnvelope(
    envelope,
    `Restauración de versión del ${previous.createdAt}`,
  );

  const handle = await getSharedHandle();
  if (handle) {
    const permission = await getHandlePermission(handle, false);
    if (permission === "granted") {
      await writeEnvelopeToHandle(handle, envelope);
    }
  }

  broadcastEnvelope(envelope);
  return envelope;
}

export function downloadPanelBackup<T>(data: T) {
  const content = JSON.stringify(data, null, 2);
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `respaldo-casagrande-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;
  link.click();

  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}