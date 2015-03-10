define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

var ViewSliceList = require('jsx!../view_slice_list');

var MessageSummary = require('jsx!../summaries/message');

var navigate = require('react-mini-router').navigate;

var MessageListPane = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      error: null,
      folder: null,
      slice: null
    };
  },

  componentWillMount: function() {
    this.props.mailApi.eventuallyGetFolderById(this.props.folderId).then(
      function gotFolder(folder) {
        this.setState({
          folder: folder,
          slice: this.props.mailApi.viewFolderMessages(folder)
        });
      }.bind(this),
      function noSuchFolder() {
        this.setState({
          error: true
        });
      }.bind(this)
    );
  },

  componentWillUnmount: function() {

  },

  render: function() {
    if (this.state.error) {
      return <div>No SucH FoldeR</div>;
    }

    if (!this.state.folder) {
      return <div>LoadinG FoldeR: {this.props.folderId}...</div>;
    }

    return (
      <div>
        <h1>{this.state.folder.name}</h1>
        <ViewSliceList
          slice={this.state.slice}
          widget={MessageSummary}
          />
      </div>
    );
  },
});

return MessageListPane;
});
