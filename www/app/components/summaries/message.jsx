import React from 'react';

import { Localized } from '@fluent/react';

import Star from '../actioners/star';
import Unread from '../actioners/unread';

import MessageReply from '../actioners/message_reply';
import MessageForward from '../actioners/message_forward';

import Attachments from './message_attachments';
import MessageBody from './message_body';

export default class MessageSummary extends React.PureComponent {
  constructor(props) {
    super(props);

    const message = props.item;
    this.state = {
      // expand all messages that are unread or starred
      expanded: !message.isRead || message.isStarred
    };
  }

  render() {
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
            <Localized
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
             <Localized id="messageDate" vars={{ date: msg.date }}/>
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
  }

  toggleExpanded() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  downloadEmbeddedImages() {
    // Although this returns a Promise, the MessageBody is clever and listens
    // to change events.  The download will result in a change notification,
    // so it does't need us poking it and we don't need the promise.
    this.props.item.downloadEmbeddedImages();
  }
}
