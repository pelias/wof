[BETA] This repo is still a work-in-progress.

## Installation

```bash
npm i -g @whosonfirst/wof
```

## Dependencies

To avoid reinventing the wheel, some code in this repo will 'shell out' to execute a common *nix command line application instead of native javascript code.

Ideally we'd like to only depend on utilities which come standard on most *nix systems, but it might be the case that your environment lacks one or more of these programs:

```bash
# check dependencies
which cat find node git bzip2 gzip pv bsdtar docker
```

```bash
# ubuntu
sudo apt-get install git bzip2 gzip pv libarchive-tools docker

# mac OSX
brew install git bzip2 gzip pv libarchive docker
```

## CLI

```bash
wof --help
wof <cmd> [args]

Commands:
  wof bundle   interact with tar bundles
  wof feature  misc functions for working with feature streams
  wof fs       interact with files in the filesystem
  wof git      interact with git repositories
  wof sqlite   interact with SQLite databases

Options:
  --version      Show version number                                   [boolean]
  --verbose, -v  enable verbose logging               [boolean] [default: false]
  --help         Show help                                             [boolean]
```

### Git

interact with git repositories

```bash
  wof git export <repo>  export features from a git repo
  wof git list <repo>    list paths in a git repo
```

#### Supported Repository Types

Both 'bare' and 'checkout' style clones are supported, these commands use the `git archive` command and so do not require the geojson files to be present in the filesystem.

If you don't need a working copy of the files you can save disk space by using a `--bare` style clone.

The following command uses only `661M` of disk space, compared to `3.8G` for the equivalent 'checkout' style clone which also extracts ~400k files to the filesystem.

```bash
git clone \
  --bare \
  --depth 1 \
  --single-branch \
  --branch master \
  https://github.com/whosonfirst-data/whosonfirst-data-admin-us.git us-bare
```

#### Git List

list paths in a git repo

```bash
wof git list /data/wof

... list of geojson files
```

```bash
wof git list /data/wof --path data/101/914/241/101914241.geojson

... list of geojson files matching the path argument
```

#### Git Export

export features from a git repo

```bash
wof git export /data/wof

... stream of geojson features
```

```bash
wof git export /data/wof --path data/101/914/241/101914241.geojson

... stream of geojson features matching the path argument
```

### SQLite

interact with SQLite databases

```bash
  wof sqlite export <db>  export features from a SQLite database
  wof sqlite import <db>  import features into a SQLite database
```

#### SQLite Export

export features from a SQLite database

```bash
wof sqlite export wof.db

... stream of geojson features
```

#### SQLite Import

import features into a SQLite database

```bash
cat 101914243.geojson | wof sqlite import --rm wof.db
```

### Feature Tools

misc functions for working with feature streams

```bash
  wof feature format      reformat a feature stream
  wof feature properties  output feature properties
  wof feature stats       generate aggregate stats
```

#### Feature Reformatting

reformat a feature stream

```bash
cat jsonstream | bin/whosonfirst.js feature format

... stream of minified json, one item per line
```

```bash
cat jsonstream | bin/whosonfirst.js feature format --open $'[\n' --sep $'\n,\n' --close $'\n]'

... stream of minified json, with array header, footer and separator
```

```bash
cat 101914243.geojson | bin/whosonfirst.js feature format --indent 2

... stream of pretty printed json
```

#### Feature Properties

output feature properties

```bash
cat 101914243.geojson | bin/whosonfirst.js feature properties -p 'wof:id' -p 'wof:placetype'

{"wof:id":101914243,"wof:placetype":"locality"}
```

#### Feature Stats

generate aggregate stats

```bash
cat 101914243.geojson | bin/whosonfirst.js feature stats

{"locality":1}
```
