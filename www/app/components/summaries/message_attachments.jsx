import React from 'react';

import Attachment from './message_attachment';

export default function MessageAttachments(props) {
  const msg = props.message;

  const attachments = msg.attachments.map((attachment) => {
    return (
      <Attachment key={ attachment.partId }
        attachment={ attachment } />
    );
  });

  return (
    <div className="message-attachments">
      { attachments }
    </div>
  );
}
