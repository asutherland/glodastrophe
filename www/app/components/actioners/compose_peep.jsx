define(function (require) {

var React = require('react');

var IntlMixin = require('react-intl').IntlMixin;
var FormattedMessage = require('react-intl').FormattedMessage;

/**
 * Render a message recipient with an 'x' button to be able to remove them in
 * a composition/write context.  Differs from `ReaderPeep` which exists in a
 * reading context.
 */
var ComposePeep = React.createClass({
  mixins: [IntlMixin],

  render: function() {
    var classes = 'compose-peep';
    var peep = this.props.peep;

    var maybeName;
    if (peep.name) {
      maybeName =
        <span className="compose-peep-display-name">{ peep.name }</span>;
    }

    return (
      <div className={ classes }>
        { maybeName }
        <span className="compose-peep-address">{ peep.address }</span>
        <button className="compose-peep-remove-button"
                onClick={ this.clickRemove }>
          X
        </button>
      </div>
    );
  },

  clickRemove: function() {
    this.props.composer.removeRecipient(this.props.bin, this.props.peep);
  }
});

return ComposePeep;
});
