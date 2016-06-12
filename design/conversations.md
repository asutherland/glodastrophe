## Margin Meta-data ##

Somewhat inspired by original Thunderbird plans to allow data annotations from
link detectors and friends.  We break the display into three columns:
* High priority context / meta-data.  A narrow column that does double duty as
  mainly whitespace with avatars and very compressed author context like IRC
  nicks and role/organization context.
* Message content.  Just the actual data/content payloads.  Sized to standard
  content width in the neighborhood of ~60-80 columns.  May have a background
  color hashed on/corresponding to the author.
* Metadata dump.  This is where extra envelope data, data annotations, etc. go.
  If you chopped this off, ideally what you're left with is a usable but
  minimal message display.

* Largely try and keep the message/data flows in a conversation as a continuous
  run without intervening whitespace context changes.  The primary goal is to
  get more of the conversation visible at a given time.
* Try and encode the "who" with more chat-style idioms:
  * Avatar to the left.
  * Colorize the body based on the author so that especially in a conversation
    with a constrained set of authors you can potentially understand what's
    going on without having to flick your eyes right/left.
    * This can also be used to colorize quoted replies based on the original
      author.  This allows us to potentially elide the original author.

### Potential Remix Variations ###

* High priority context column made into magic-anchored author thread view.
  For the current message (and any small messages in proximity?), the author
  lines up.  But otherwise it's a thread view by author.  So clicking can
  navigate.  (Based on one of the Thunderbird full-conversation experiments,
  namely https://www.flickr.com/photos/davidascher/3095078638/)

