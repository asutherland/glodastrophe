define(function (require) {
'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');

const { FormattedMessage, FormattedRelative } = require('react-intl');

const Star = require('../actioners/star');
const Unread = require('../actioners/unread');

const MessageReply = require('../actioners/message_reply');
const MessageForward = require('../actioners/message_forward');

const Attachments = require('./message_attachments');
const MessageBody = require('./message_body');

const MessageSummary = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    item: React.PropTypes.object.isRequired,
    pick: React.PropTypes.func.isRequired,
    selected: React.PropTypes.bool.isRequired
  },

  getInitialState: function() {
    const message = this.props.item;
    return {
      // expand all messages that are unread or starred
      expanded: !message.isRead || message.isStarred
    };
  },

  render: function() {
    const msg = this.props.item;

    var itemClassNames = 'message-item';
    var envClassNames = 'message-envelope-container';
    var bodyish;
    if (this.state.expanded) {
      // -- Expanded
      itemClassNames += ' message-item-expanded';
      envClassNames += ' message-envelope-expanded';

      var maybeDownloadEmbeddedImages;
      if (msg.embeddedImageCount &&
          !msg.embeddedImagesDownloaded &&
          !msg.isDownloadingEmbeddedImages) {
        maybeDownloadEmbeddedImages = (
          <div className='message-download-embedded-images'
            onClick={ this.downloadEmbeddedImages } >
            <FormattedMessage
              id='messageDownloadEmbeddedImages' />
          </div>
        );
      }

      bodyish = (
        <div className="message-expanded-region">
          <Attachments key="attachments" message={ msg } />
          { maybeDownloadEmbeddedImages }
          <MessageBody key="body" message={ msg } />
        </div>
      );
    } else {
      // -- Collapsed
      itemClassNames += ' message-item-collapsed';
      envClassNames += ' message-envelope-collapsed';
      bodyish = <div className="message-snippet">{ msg.snippet || '' }</div>;
    }

    return (
      <div className={ itemClassNames }>
        <div className={ envClassNames } onClick={ this.toggleExpanded }>
          <div className="message-envelope-row">
            <Unread item={ msg } />
            <Star item={ msg } />
            <div className="message-date">
              <FormattedRelative value={msg.date} />
            </div>
            <div className="message-author">
              { msg.author.name || msg.author.address }
            </div>
            <div className="message-actions">
              <MessageForward {...this.props} item={ msg } />
              <MessageReply {...this.props} item={ msg } />
            </div>
          </div>
        </div>
        { bodyish }
      </div>
    );
  },

  toggleExpanded: function() {
    this.setState({
      expanded: !this.state.expanded
    });
  },

  downloadEmbeddedImages: function() {
    // Although this returns a Promise, the MessageBody is clever and listens
    // to change events.  The download will result in a change notification,
    // so it does't need us poking it and we don't need the promise.
    this.props.item.downloadEmbeddedImages();
  }
});

return MessageSummary;
});
