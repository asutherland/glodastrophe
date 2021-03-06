## What?

glodastrophe is an experimental desktop (and maybe tablet) UI for the gaia email
client backend.  It's coming out of mothballs to be a Phabricator review queue
tool, maybe.

Its name was an attempt at a clever reference that will not actually seem clever
if you understand it.  My apologies if you understand it.

## Why?

User agency in messaging/communication is important.  In many ways open source
is doing well here, but in many ways it is not.

But most important is me better understanding what's up with my Phabricator
reviews.

### Brief Comparisons with other Open Source Projects

There was previously some mention of Nylas N1 and Mailpile here, but Nylas seems
to have now been abandoned and forked to Mailspring with a closed source (but
local) C++ sync engine and Mailpile is perhaps hibernating?

Although the backend supports POP3 and IMAP, any email support going forward
will probably be limited to JMAP with the POP3 and IMAP support ripped out
because JMAP is good and IMAP is bad and POP3 is horrible.

The main thing to know is that you should probably use something else.  Probably
Thunderbird!

## How do I try and use it?

It's going to be a webextension now, so probably wait for that.  If you want to
develop it, probably check out the docs at
https://github.com/asutherland/tabdrome#developing because that's the existing
setup I'm reusing.

See DIRECTORIES.md to better understand what's going on with all these
directories.

## How did I previsouly use it / hack on it?

**THE BELOW IS OUTDATED UNLESS TCPSOCKET SUPPORT COMES BACK**

I'm in the process of finishing up an overhaul so we use the following emerging
standard stack:
* npm with webpack for packages and bundling.  (Previously we used the RequireJS
  family of volo/r.js/alameda and some loaders, but this ended up being
  problematic as the JS ecosystem moves towards npm packages and transpiling.)
* react (already used) UI, with redux for UI state management.  The email /
  messaging domain state management is handled by the backend which has a
  unidirectional flow like flux but is not flux.  (There's a whole tasks
  abstraction deeply concerned with not losing user data and not driving the
  backend programmers insane.)  See www/app/README.md for more on this.

This means that for local development you can do `npm start` and it will stand
up a server on http://glodastrophe:3000/ after you do the other bootstrap steps
below.

The immediate goals which have not yet been accomplished are:
* Create a Firefox WebExtensions-based addon that can do TCP email stuff once
  https://bugzilla.mozilla.org/show_bug.cgi?id=1247628 is fixed (and which we
  will help fix).
* Create a web variant that does not include TCP-requiring account types but
  can talk to servers like discourse or scrape mailing list archives/etc. and
  be something people can play with.  We need the new account types for this.

### Bootstrapping for development.

Make sure you do or have done the following:

- Be using Firefox.  We need it for Gecko's TCPSocket implementation.
  Alternately, be a very eager contributor where one of the following is true:
  - You don't care about TCP and want to help do things with protocols like JMAP
    or APIs like Discourse's.  It probably won't take much to not freak out
    without TCPSocket, but we may also have some other Gecko-isms that need to
    be shaken out or shimmed.
  - You do care about TCP and want to help adapt us to run as a Google Chrome
    App.  We have to be a Chrome Apps because only Chrome Apps have access to
    TCP APIs.  There are shims for Chrome's TCP API at
    https://github.com/emailjs/emailjs-tcp-socket that will make this more
    manageable.  The biggie for this is just that some rejiggering will be
    required to handle the runtime differences if we haven't already addressed
    this for running inside Firefox as a WebExtension.  Namely, the app
    currently assumes a single page with a single worker.  The architecture can
    absolutely handle the WebExtensions model, but some plumbing is required.
- Clone this repo with "--recursive" because it has submodules.  Oh yes,
  submodules.  If you forgot to do this, now is the time to do
  "git submodule update --init --recursive".
- Do `npm install`.  Ideally using node 4.x with npm 2.x.  I use "nvm" for
  this, which is also why there happens to be an `.nvmrc` in the root of the
  project.
- Add a localhost-style entry for "glodastrophe" to your /etc/hosts so you can
  get a custom origin.  The goal is to isolate the special TCP permission Do this
  by adding a line like the following to your `/etc/hosts`.  The IP does not
  matter as long as it's in the loopback net; IPv6 loopback stuff is probably
  also fine.
```
127.0.2.1	glodastrophe
```
- Install the extension from https://github.com/mykmelez/tcpsocketpup in your
  Firefox (preferably nightly) by going to that URL, clicking on "Latest
  release", then clicking on the XPI download.  A door-hanger thing should
  happen to let you allow the installation of the extension, etc.  Do the
  danger dance and get that extension installed.
- The extension uses a plug icon thing to toggle the permissions of the current
  site.  It may or may not already be in your hamburger menu.  If not, or that's
  not where you want it (I put mine on my toolbar), bring up your hamburger menu
  and hit customize and drag it onto your toolbar or whatever.
- Browse to http://glodastrophe:3000/
- You should see something boring.
- Click the pluggy icon to give all kinds of dangerous permissions to the
  glodastrophe origin.
- Probably reload the page so we can make sure that the dangerous permissions
  are totally available to the code.
- Now you can add an email account!  Hooray!

