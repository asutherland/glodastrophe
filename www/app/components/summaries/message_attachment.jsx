define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;
var FormattedRelative = require('react-intl').FormattedRelative;

var MessageAttachment = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    var tach = this.props.attachment;
    return (
      <div className="message-attachment-item">
        <div className="attachment-filename">{ attachment.filename }</div>
        <div className="attachment-size">
          { attachment.sizeEstimateInBytes }
        </div>
      </div>
    );
  },
});

return MessageAttachment;
});
