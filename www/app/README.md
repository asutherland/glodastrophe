## State Management ##

In short:

* redux is used to describe the state of the UI
* The email backend (GELAM) is responsible for tracking and maintaining the
  state of messages, user requests to act on messages, etc.

### Disclaimers / Rationale ###

Currently this is the game-plan that seems to make sense.  I've never used redux
before, so I could be naive about some things.  However, based on a quick skim
of how various Firefox devtools use redux given the (more mutation based)
debugger backends, I don't think it's immediately insane.

The primary rationale for choosing redux is that it seems like an intelligent
and pragmatic approach for state management rather than an ad-hoc mess of
distributed state.  (Which is where various quick ad-hoc dev hacks were leading
us.)  But it is a non-goal to have the world's cleanest use of redux.  We want
the thinnest, simplest implementation we can have, pushing as much as possible
into the GELAM back-end and potential extensions because we want the maximum
reuse out of that among other mail/messaging clients that do not want to be
made of react, redux, etc.

### Examples ###

* Filtering search.  Redux state tracks the folder we're in, the filter
  parameters, any visualizations that should be computed, etc.  We use this
  redux state to issue/update the list view request to the backend.  The backend
  provides the results and all message states.  The backend uses EventEmitter
  style events to notify when new data is available, changed, etc.  As we
  scroll, redux can track our seek position according to what makes sense for
  persistence (either based on a specific id or coordinate-space based).  The
  messages themselves never are archived into redux state.  If the user acts on
  a message, no direct change in redux state needs to occur unless there is also
  an implicit UI action to be taken.  (For example, if deleting a displayed
  message/conversation, it may make sense for the UI to advance to displaying a
  different message/conversation instead without waiting for the backend to
  propagate the change through.)

### State and Routing ###

tl;dr: For now, we're treating the URL as orthogonal to the state and making
sure there is no duplication/overlap between the two.

As I write this, there seems to be a tremendous amount of flux (pun not
intended) in the thinking of how to handle the state interaction between redux
and react-router/history.  Many deep thoughts, and we absolutely want the
results of whatever happens.  But as noted in the disclaimers/rationale, we
don't need to be perfect.

So, in a regression from our pre-redux react-mini-router implementation, we're
going to treat the routes as very simple "what component am I looking at?"
mechanisms.  The hash paths that previously existed and fully specified the id's
of everything, like "/view/3col/:accountId/:folderId/:conversationId" will now
just be "/view/3col".  Account/folder/conversation/message changing will all
be handled by redux for now.

And when the redux router situation gets cleared up, ideally we'll be able to
map this simple state back into the URL in a sane way that can be bookmarked
and respond better to history.


### Redux State Structure ###

* mailApi: The MailAPI singleton instance that everyone could just require on
  their own, but why would we do that?
* sidebar: It always displays the list of all accounts followed by the list of
  folders for that account.
  * open: Boolean.  Is the sidebar open?  
* viewing: Fully characterizes what message-related content we're looking at.
  * selections:
    * accountId: valid id or null
    * folderId: valid id or null
    * conversationId: valid id or null
    * messageId: valid id or null.  Note that there is no `message`
  * filtering: Characterizes the current filter parameters and whether they're
  applied.
    * textFilter:
      * filterText: String to use for the sender, recipients, subject, and body
      filters.  (Under the hood they can actually be different strings, but
      that's not a sane UX for the primary use-case.  Any super fancy filtering
      can have its own state tracking.)
      * filterSender: Boolean
      * filterRecipients: Boolean
      * filterSubject: Boolean
      * filterBody: Boolean
    * otherFilters: Map of other active filter things.
  * live
    * account: MailAccount instance or null.
    * folder: MailFolder or null.
    * conversationsView
    * conversation: MailConversations or null.
    * messagesView
  * visualizations: See VisDef definition below.
    * conversationsOverview: Array of VisDef.
    * conversationsSidebar: Array of VisDef
    * conversationSummary: VisDef or null
    * conversationOverview: Array of VisDef

Our made-up VisDef is TBD.  It will either just be a Vega definition or a
definition with some minor wrapping.

## Coding Style, Etc. ##

Intentional decisions that made sense in 2016 but almost certainly should be
revisited now.  Particuarlly as it relates to JS modules.  Transpiling is now
basically a given and this is no longer a project targeted at anyone but its
developers, giant blobs of JS are less of a concern than they were for Firefox
OS.

* Only transpile JSX.  Stick to ES6/ES2015 features on
  http://kangax.github.io/compat-table/es6/ that beta versions of Firefox and
  Chrome understand.  This mainly means don't use ES modules.  The rationale for
  this is:
  * Minimize transpiling.  Obviously, JSX is a sore-thumb here, but I'm more
    of the mind to abandon JSX than transpile extra stuff.
  * Dynamic loading.  As far as I understand it, the ES module dynamic loader
    stuff was generally punted on.  Webpack supports both the AMD dynamic
    require([...], callback) and the CommonJS-y require.ensure().  Dynamic
    loading of code via chunks is very functionally important for scaling, etc.,
    so it makes sense to use these known and understood mechanisms.
    Additionally, destructuring means that we can already do things like:
    `const { foo, bar, baz } = require('module');` which gets us a lot of the
    exciting benefits of the ES modules.

Current conventions that don't matter:

* React.createClass versus functional things or ES classes.  createClass was
  used initially for a variety of legacy reasons that are no longer relevant.
  The pure functions seem cool and anything that can be done to make code
  smaller, simpler, etc. is great.

## Localization ##

`react-intl` was adopted originally as the best/only alternative, but
https://www.projectfluent.org/ has come a long way since then and it seems
appropriate to transition to
https://github.com/projectfluent/fluent.js/tree/master/fluent-react