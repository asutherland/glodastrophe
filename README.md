## FAQ

### What is it?

It's a glodastrophe, obviously.

### No, really, what is it?

It's a development email client.

### Sweet!  I want to use it!

You almost certainly do not.

### Because of gloda?

There's not actually any gloda in here.  So, no.

## How to try it out

- Be a contributor to gaia-email-libs-and-more who doesn't cringe at the
  thought of making contributions to gaia-email-libs-and-more.
- Clone this repo with "--recursive" because it has submodules.  Oh yes,
  submodules.  If you forgot to do this, now is the time to do
  "git submodule update --init --recursive".
- Be using Ubuntu or maybe Debian linux.  Or understand how to translate from
  those to whatever your platform is, or just understand the goals described
  below.  (Really you just need to serve this directory.  We could probably
  do this easily with a node script...)
- Add a localhost entry for something like "glodastrophe" so you can get a
  custom origin.  This is vitally important for security reasons.  One way to
  do this is add a line like the following to your /etc/hosts:
```
127.0.2.1	glodastrophe
```
- Serve the contents of this repo via http on localhost somehow.  Here's an
  example of the site I added to my /etc/apache2/sites-available as
  glodastrophe.conf and then enabled via "a2ensite glodastrophe".  Your paths
  will vary.
```
<VirtualHost *:80>
  ServerName glodastrophe
  ServerAlias glodastrophe
  DocumentRoot /home/visbrero/rev_control/wgit/glodastrophe/
</VirtualHost>

<Directory /home/visbrero/rev_control/wgit/glodastrophe>
  Require all granted
</Directory>
```
- Make sure caching is not betraying you.  I have the following in
  /etc/apache2/conf-available as no-cache.conf enabled via "a2enconf no-cache"
  following "a2enmod cache" and "a2enmod expires":
```
CacheDisable /
CacheMaxExpire 3
ExpiresActive On
ExpiresDefault "access plus 3 seconds"
```
- Do "service apache2 reload"
- Verify that you can see this README.md file at http://glodastrophe/README.md
- You can't?  You must've screwed something up.  Or I told you the wrong thing.
  I do feel bad about things either way.
- Install the extension from https://github.com/mykmelez/tcpsocketpup in your
  Firefox (preferably nightly) by going to that URL, clicking on "Latest
  release", then clicking on the XPI download.  A door-hanger thing should
  happen to let you allow the installation of the extension, etc.  Do the
  danger dance and get that extension installed.
- The extension uses a plug icon thing to toggle the permissions of the current
  site.  It may or may not already be in your hamburger menu.  If not, or that's
  not where you want it (I put mine on my toolbar), bring up your hamburger menu
  and hit customize and drag it onto your toolbar or whatever.
- Browse to http://glodastrophe/www/index.html
- You should see something boring.
- Click the pluggy icon to give all kinds of dangerous permissions to the
  glodastrophe origin.
- Probably reload the page so we can make sure that the dangerous permissions
  are totally available to the code.
- Now you can add an email account!  Hooray!
- Contribute to gaia-email-libs-and-more/convoy and this repo.
