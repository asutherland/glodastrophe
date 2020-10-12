import React from 'react';

export default function PatchSummary(props) {
  const patchInfo = props.patchInfo;

  // Sort the directory paths so they're alphabetical.
  const dirInfos = patchInfo.dirInfos.concat();
  dirInfos.sort((a, b) => a.dirName.localeCompare(b.dirName));

  const dirRows = dirInfos.map((dirInfo) => {
    const filePieces = [];
    for (const { linesAdded, linesDeleted } of dirInfo.fileInfos) {
      const logAdded = linesAdded && Math.floor(Math.log2(linesAdded));
      const logDeleted = linesDeleted && Math.floor(Math.log2(linesDeleted));

      if (logAdded) {
        filePieces.push(
          <span key={filePieces.length} className="patch-add">{ '+'.repeat(logAdded) }</span>
        );
      }
      if (logDeleted) {
        filePieces.push(
          <span key={filePieces.length} className="patch-del">{ '-'.repeat(logDeleted) }</span>
        );
      }
      filePieces.push(' ');
    }

    return (
      <div key={ dirInfo.dirName }>
        { dirInfo.dirName }: <span className="patch-deltas">{ filePieces }</span>
      </div>
    );
  });

  return (
    <div className="patch-summary">
      { dirRows }
    </div>
  );
}
