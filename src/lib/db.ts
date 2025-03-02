const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("biztosoDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target?.result;
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export { openDB };
