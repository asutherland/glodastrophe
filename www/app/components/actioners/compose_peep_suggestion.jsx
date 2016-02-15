define(function (require) {
'use strict';

var React = require('react');

/**
 * Widget rendered for matching MailPeep instances in autocomplete results.
 */
var ComposePeepSuggestion = React.createClass({
  render: function() {
    var classes = 'compose-peep-suggestion';
    var peep = this.props.peep;

    var maybeName;
    if (peep.name) {
      maybeName =
        <span className="compose-peep-suggestion-display-name">
          { peep.name }
        </span>;
    }

    return (
      <div className={ classes }>
        { maybeName }
        <span className="compose-peep-suggestion-address">
          { peep.address }
        </span>
      </div>
    );
  }
});

return ComposePeepSuggestion;
});
