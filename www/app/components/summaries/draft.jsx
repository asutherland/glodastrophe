define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;
var FormattedRelative = require('react-intl').FormattedRelative;

var navigate = require('react-mini-router').navigate;

var SliceItemMixin = require('../slice_item_mixin');

var Star = require('jsx!../actioners/star');
var Unread = require('jsx!../actioners/unread');


var Attachment = require('jsx!./message_attachment');
var MessageBody = require('jsx!./message_body');

/**
 * Editable message draft, intended to be used where you'd otherwise display
 * a MessageSummary (using conditionalWidget).  Automatically acquires a
 * `MessageComposition` instance when bound, at which point we can render
 * ourselves.
 *
 * The state maintenance idiom could potentially be improved.  For now we store
 * canonical state in the MessageComposition instance since this simplifies
 * initial population.  We don't bother maintaining a serial number on the
 * composer and instead just forceUpdate.
 */
var DraftSummary = React.createClass({
  mixins: [IntlMixin, React.addons.PureRenderMixin],

  getInitialState: function() {
    return {
      composer: null,
      serial: 0
    };
  },

  _getComposer: function() {
    this.dirtiedBodyRetriever = null;
    this.props.message.editAsDraft().then((composer) => {
      composer.on('change', () => {
        this.setState({ serial: composer.serial });
      })
      this.setState({ composer });
    });
  },

  componentDidMount: function() {
    this._getComposer();
  },

  componentWillUnmount: function() {
    if (this.state.composer) {
      this.state.composer.release();
    }
  },

  componentWillReceiveProps: function(nextProps) {
    // Assert that our message never changes.
    if (nextProps.message !== this.props.message) {
      throw new Error('Our message must never change!');
    }
  },

  render: function() {
    var composer = this.state.composer;
    if (!composer) {
      return <div></div>;
    }

    let makeRecipRow = (bin, l10nId) => {
      let composePeeps = composer[bin].map((nameAddrPair) => {
        return (
          <ComposePeep key={ nameAddrPair.address }
                       bin={ bin }
                       composer={ composer }/>
        );
      });

      return (
        <div className="draft-recip-row">
          <span className="draft-recip-bin-label">
            <FormattedMessage message={ this.getIntlMessage(l10nId) } />
          </span>
          { composePeeps }
          <ComposePeepAdder
            bin={ bin }
            composer={ composer }
            />
        </div>
      );
    };

    return (
      <div className="draft-item">
        { makeRecipRow('to', 'composeLabelTo') }
        { makeRecipRow('cc', 'composeLabelCc') }
        { makeRecipRow('bcc', 'composeLabelBcc') }
        <input type="text"
               value={ composer.subject }
               onChange={ this.subjectChange } />
        <MediumEditor initialContent={ composer.textBody }
                      onDirty={ this.bodyDirtied }
                      />
        <div className="draft-buttons">
          <button>
            <FormattedMessage
              message={ this.getIntlMessage('composeSend') } />
          </button>
          <button>{ '\u1f4ce' }</button>
          <button>
            <FormattedMessage
              message={ this.getIntlMessage('composeDiscard') } />
          </button>
        </div>
      </div>
    );
  },

  subjectChange: function(event) {
    this.props.composer.setSubject(event.target.value);
  },

  bodyDirtied: function(retrieveFunc) {
    this.dirtiedBodyRetriever = retrieveFunc;
  },

  saveDraft: function() {
    let composer = this.props.composer;
    if (this.dirtiedBodyRetriever) {
      composer.textBody = this.dirtiedBodyRetriever();
      this.dirtiedBodyRetriever = null;
    }
    composer.saveDraft();
  }
});

return DraftSummary;
});
