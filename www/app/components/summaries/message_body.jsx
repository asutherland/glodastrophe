import React from 'react';

import embodyPlain from 'gelam/clientapi/bodies/embody_plain';
import embodyHTML from 'gelam/clientapi/bodies/embody_html';

/**
 * Renders the body parts for a message.  If the body parts are not yet
 * downloaded, a spinner will be displayed (XXX someday! :) and part downloading
 * will be triggered.  If the account were offline, a "we are offline, no bodies
 * for you" message could also be displayed.
 *
 * The GELAM embody* methods are currently used to populate the body parts.
 * These are non-react DOM generators.  For current implementation simplicity,
 * we take a "we will embody the body exactly once, which is the first instant"
 * we have all of the body parts.
 * XXX move these out of gelam and into glodastrophe per discussion
 *
 * This is a single-use binding and parents should key us appropriately!
 */
export default class MessageBody extends React.Component {
  constructor(props) {
    this.state = {
      embodied: false
    };

    this.placeholderRef = React.createRef();
  }

  /**
   * Function to create the body parts, if possible.  Bails early if the body
   * parts aren't retrieved yet.  This allows the method to directly be invoked
   * every time a "change" event is received for the message.
   */
  _embody() {
    var message = this.props.message;
    if (this.state.embodied) {
      return;
    }
    if (!message.bodyRepsDownloaded) {
      return;
    }

    var contentNode = this.placeholderRef.current;
    var embodyPromises = [];

    message.bodyReps.forEach(function(rep) {
      var node = document.createElement('div');
      contentNode.appendChild(node);

      if (rep.type === 'plain') {
        node.setAttribute('class', 'message-text-part-container');
        embodyPlain(rep.contentBlob, node);
      } else if (rep.type === 'html') {
        node.setAttribute('class', 'message-text-html-container');
        let { loadedPromise } = embodyHTML(rep.contentBlob, node);
        embodyPromises.push(loadedPromise);
      }
    });

    message.removeListener('change', this._embody);
    this.setState({
      embodied: true
    });

    // If this message has embedded images...
    if (message.embeddedImageCount) {
      // (after the bodies are embodied)
      Promise.all(embodyPromises).then(() => {
        // ...and they're already downloaded, then show them.
        if (message.embeddedImagesDownloaded) {
          this._showEmbeddedImages();
        } else {
          // otherwise, listen for a change in case they get downloaded (for any
          // reason.)
          message.on('change', this._showEmbeddedImages);
        }
      });
    }
  }

  _showEmbeddedImages() {
    var message = this.props.message;
    if (!message.embeddedImagesDownloaded) {
      return;
    }

    var contentNode = this.placeholderRef.current;
    Array.from(contentNode.querySelectorAll('iframe')).forEach((iframe) => {
      message.showEmbeddedImages(iframe.contentDocument.body);
    });

    message.removeListener('change', this._showEmbeddedImages);
  }

  componentWillMount() {
    // Trigger body part download if they aren't already downloaded.
    var message = this.props.message;
    if (!message.bodyRepsDownloaded) {
      message.downloadBodyReps();
      // every time we hear a change, maybe try and embody ourselves
      message.on('change', this._embody);
    }
  }

  componentDidMount() {
    // Try and embody if we have the parts.  componentWillMount took care of
    // making the requests already, if needed.
    this._embody();
  }

  componentWillUnmount() {
    this.props.message.removeListener('change', this._embody);
    this.props.message.removeListener('change', this._showEmbeddedImages);
  }

  componentWillReceiveProps(nextProps) {
    // Assert that our message never changes.
    if (nextProps.message !== this.props.message) {
      throw new Error('Our message must never change!');
    }
  }

  shouldComponentUpdate(/*nextProps, nextState*/) {
    // We handle everything internally for a single message.  We will never
    // receive new state because we require that our owner/parent be keyed so
    // that neither it nor its child bindings will be reused.
    //
    // (We will be listening for "change" events and directly manipulating the
    // DOM when the body parts show up.)
    return false;
  }

  render() {
    var msg = this.props.item;
    return (
      <div
        ref={ this.placeholderRef }
        className="message-body-container"></div>
    );
  }

  clickMessage() {
    if (this.props.pick) {
      this.props.pick(this.props.item);
    }
  }
};
