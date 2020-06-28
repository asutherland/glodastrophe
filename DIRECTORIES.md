This file attempts to document all of the top-level directories and their
contents, as well as nested directories that are of notable relevance.

- `autoconfig`:  ISP Database autoconfig example files.  Ignore these.
- `build`:
- `deps`:
  - `gelam`: The backend which lives in its own project and is included via
    git submodule.  To make things extra exciting, it has nested git submodules.
    Sorry.
    - `default_app_logic`: Example app logic and glue code that should be
      provided by each application built on the GELAM engine/backend.
      glodastrophe's versions of these live at `www/app/felam` which is a very
      bad reference to an infamous shoe insert commercial and should be renamed
      to something better.  Sorry again.
    - `js`: The backend source code.
    - `logic-inspector`: A cool log viewing UI that's sorta its own project.
      GELAM was heavily instrumented with logging with the logging tied into
      testing so that it was easier to understand how the system works and
      what's going wrong when things break.
- `design`: Intended home of documentation of UX decisions.  What's in there
  probably does not correlate with reality.
- `node_modules`: NPM stores installed modules here as controlled by
  `/package.json`.
- `static`: HTML and CSS and any files that are not source files and are not
  transformed by the build process and should be placed in the build output
  in their entirety.
- `tools`: Historical `r.js` build stuff I think that can probably now be
  removed.
- `www`: The source of the glodastrophe UI.  The contents of this directory and
  any installed `node_modules` and `deps/gelam` make up the entirety of the
  codebase.
  - `app`: The core application logic.
  - `lib`: Vendored and possibly forked JS.  This directory primarily dates from
    use of the `r.js` and `volo` toolchains which used vendored JS.  See the git
    logs of files for attribution and sources.  Note that `r.js` related things
    can probably be removed.
  - `locales`: `react-intl` was used initially for internationalization, and
    this is the home for its locale files.  A transition to fluent-react should
    likely be made.
