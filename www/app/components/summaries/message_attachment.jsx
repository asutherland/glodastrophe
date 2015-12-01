define(function (require) {
'use strict';

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var MessageAttachment = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    var attachment = this.props.attachment;

    var maybeDownload;
    if (attachment.isDownloaded) {
      maybeDownload = <div>
        <button onClick={ this.viewAttachment }>
          <FormattedMessage
            message={ this.getIntlMessage('attachmentView')} />
        </button>
      </div>;
    } else if (attachment.isDownloading) {
      maybeDownload = <div>
        <FormattedMessage
          message={ this.getIntlMessage('attachmentDownloading')} />
      </div>;
    } else if (attachment.isDownloadable) {
      maybeDownload = <div>
        <button onClick={ this.download }>
          <FormattedMessage
            message={ this.getIntlMessage('attachmentDownload')} />
        </button>
      </div>;
    } else {
      maybeDownload = <div className="message-attachment-no-download">
        <FormattedMessage
          message={ this.getIntlMessage('attachmentNoDownload')} />
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
  },

  viewAttachment: function() {
    var attachment = this.props.attachment;
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
  },

  download: function() {
    // DeviceStorage is no good on desktop.  Just store stuff in IndexedDB.
    this.props.attachment.download({ downloadTarget: 'cache' });
  }
});

return MessageAttachment;
});
