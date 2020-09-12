import React from 'react';

import { Localized } from '@fluent/react';

export default function MessageAttachment(props) {
  const attachment = props.attachment;

  function onViewAttachment() {
    console.log('getting blob');
    attachment.getDownloadedBlob().then((blob) => {
      console.log('got blob');
      var url = URL.createObjectURL(blob);
      console.log('opening URL');
      window.open(url);
      // eh, this is probably tight enough to be efficient and safe.
      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 0);
    });
  }

  function onDownload() {
    // DeviceStorage is no good on desktop.  Just store stuff in IndexedDB.
    attachment.download({ downloadTarget: 'cache' });
  }

  var maybeDownload;
  if (attachment.isDownloaded) {
    maybeDownload = <div>
      <button onClick={ onViewAttachment }>
        <Localized
          id='attachmentView' />
      </button>
    </div>;
  } else if (attachment.isDownloading) {
    maybeDownload = <div>
      <Localized
        id='attachmentDownloading' />
    </div>;
  } else if (attachment.isDownloadable) {
    maybeDownload = <div>
      <button onClick={ onDownload }>
        <Localized
          id='attachmentDownload' />
      </button>
    </div>;
  } else {
    maybeDownload = <div className="message-attachment-no-download">
      <Localized
        id='attachmentNoDownload' />
    </div>;
  }

  return (
    <div className="message-attachment-item">
      <div className="message-attachment-mimetype">
        { attachment.mimetype }
      </div>
      <div className="message-attachment-filename">
        { attachment.filename }
      </div>
      <div className="message-attachment-size">
        { attachment.sizeEstimateInBytes }
      </div>
      <div className="message-attachment-download-slot">
        { maybeDownload }
      </div>
    </div>
  );
}

