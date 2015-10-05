This file is brainstorming for the extension mechanism.

## UI Extensions ##

Our extensible UI is based on a hierarchy of pluggable widgets.

### Layouts ###

Layouts specify a configuration of typed panes and the selection flow amongst
panes.  (Most of the time the selection flow is inherent, but if there are
multiple panes of the same type, then it really needs to be explicit.)

For example, the standard 3-column mail layout would include a "folder list"
pane, a "conversation list" pane, and a "message list" pane.  Selecting a folder
in the "folder list" pane causes the "conversation list" pane to display the
messages in that folder, and selecting a conversation from that pane causes
the "message list" pane to display the messages in that folder.

### Panes ###

Panes are typed widgets that are responsible for

### Header Widgets ###

### List Widgets ###

### Summary Widgets ###

Summary widgets provide the definitive overview for an item

### Toolbar ###


## Workflow Extensions ##

Workflow extensions enable a mail-handling experience that is deeper than just
UI layout.

This can involve:
- defining tags/labels to apply to messages
- defining filters to be used in message display
- defining named macro-like behavior which can be used to create buttons/etc.
  where the behavior can include:
  - tags/labels are applied/removed
  - messages are moved to specific folders.
  - automatically forward / reply to the message.
- defining timer-based behavior, where a label is added/removed after a certain
  timeout (as long as some other condition holds true)


## Examples ##

### Layout Examples ###

For example, the following ASCII art demonstrates various layouts possible,
where the letters mean:
- F: Folder list
- C: Conversation list
- M: Message list with in-line expanded/expanding messages
(Variants of this that are message-centric and put envelopes where conversations
go and bodies where message lists go would make this more Thunderbirdy.)

3 column / "Vertical" 3-pane:
```
F|C|M
F|C|M
F|C|M
```

"Classic" 3-pane:
```
F|C
F|-
F|M
```

"Wide" 3-pane:
```
F|C
---
MMM
```

### Workflow Examples ###

- Set a timer to revisit the conversation after some amount of time has elapsed,
  perhaps waiting to see if other people have responded.  Perhaps the timer
  automatically clears if someone other than the author responds to it, or
  someone in a group.
- Set a timer to automatically reply to the message after 1 day, saying
  "did this get addressed?"  (For those situations where the person will
  probably figure it out on their own and then fail to retract their question,
  and you are too busy to answer right now and/or want them to try and figure
  it out on their own, etc.)
- Very specific auto-responders.  Ex: "I am in a super important meeting right
  now, but messages from you are my top priority, I will read your email and
  get back to you when the meeting is over."  Could possibly source from
  calendar.  Autoresponder could be somewhat pluggable so in the fallback case,
  the device does it itself, but if there is server support somehow, that is
  used.
