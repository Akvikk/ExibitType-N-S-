export const exportSessionData = (history: { spin: number }[]) => {
  const dataToExport = {
    timestamp: Date.now(),
    spins: history.map(entry => entry.spin)
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `roulette_session_${Date.now()}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const importSessionData = (file: File): Promise<number[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        if (parsedData && Array.isArray(parsedData.spins)) {
          resolve(parsedData.spins);
        } else {
          reject(new Error("Invalid file format. Expected a JSON object with a 'spins' array."));
        }
      } catch (error) {
        reject(new Error("Error parsing JSON file."));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file."));
    reader.readAsText(file);
  });
};
