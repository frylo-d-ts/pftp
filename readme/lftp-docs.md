# LFTP mirror docs

cutout from here: https://lftp.yar.ru/lftp-man.html

Table of content:
- [`mirror` command](#mirror-command)
- [`mput` command](#mput-command)
- [`put` command](#put-command)


## `mirror` command

`mirror [OPTS] [source [target]]`

> Mirror specified source directory to the target directory.
>
> By default the source is remote and the target is a local  directory.   When  using  -R,  the
> source directory is local and the target is remote.  If the target directory is omitted, base
> name of the source directory is used.  If both directories are  omitted,  current  local  and
> remote directories are used.
>
> The source and/or the target may be URLs pointing to directories.
>
> If  the  target directory ends with a slash (except the root directory) then base name of the
> source directory is appended.
>
>        -c,      --continue                 continue a mirror job if possible
>        -e,      --delete                   delete files not present at the source
>                 --delete-excluded          delete files excluded at the target
>                 --delete-first             delete old files before transferring new ones
>                 --depth-first              descend into  subdirectories  before  transferring
>                                            files
>                 --scan-all-first           scan  all directories recursively before transfer
>                                            ring files
>        -s,      --allow-suid               set suid/sgid bits according to the source
>                 --allow-chown              try to set owner and group on files
>                 --ascii                    use ascii mode transfers (implies --ignore-size)
>                 --ignore-time              ignore time when deciding whether to download
>                 --ignore-size              ignore size when deciding whether to download
>                 --only-missing             download only missing files
>                 --only-existing            download only files already existing at target
>        -n,      --only-newer               download only newer files (-c won't work)
>                 --upload-older             upload even files older than the target ones
>                 --transfer-all             transfer all files, even seemingly the same at the
>                                            target site
>                 --no-empty-dirs            don't    create    empty    directories   (implies
>                                            --depth-first)
>        -r,      --no-recursion             don't go to subdirectories
>                 --recursion=MODE           go to subdirectories on a condition
>                 --no-symlinks              don't create symbolic links
>        -p,      --no-perms                 don't set file permissions
>                 --no-umask                 don't apply umask to file modes
>        -R,      --reverse                  reverse mirror (put files)
>        -L,      --dereference              download symbolic links as files
>                 --overwrite                overwrite plain files without removing them first
>                 --no-overwrite             remove and re-create plain files instead of  over
>                                            writing
>        -N,      --newer-than=SPEC          download only files newer than specified time
>                 --older-than=SPEC          download only files older than specified time
>                 --size-range=RANGE         download only files with size in specified range
>        -P,      --parallel[=N]             download N files in parallel
>                 --use-pget[-n=N]           use pget to transfer every single file
>                 --on-change=CMD            execute the command if anything has been changed
>                 --loop                     repeat mirror until no changes found
>        -i RX,   --include=RX               include matching files
>        -x RX,   --exclude=RX               exclude matching files
>        -I GP,   --include-glob=GP          include matching files
>        -X GP,   --exclude-glob=GP          exclude matching files
>                 --include-rx-from=FILE
>                 --exclude-rx-from=FILE
>                 --include-glob-from=FILE
>                 --exclude-glob-from=FILE   load  include/exclude  patterns from the file, one
>                                            per line
>        -f FILE, --file=FILE                mirror  a  single  file  or  globbed  group  (e.g.
>                                            /path/to/*.txt)
>        -F DIR,  --directory=DIR            mirror  a  single directory or globbed group (e.g.
>                                            /path/to/dir*)
>        -O DIR,  --target-directory=DIR     target base path or URL
>        -v,      --verbose[=level]          verbose operation
>                 --log=FILE                 write lftp commands being executed to FILE
>                 --script=FILE              write lftp commands to  FILE,  but  don't  execute
>                                            them
>                 --just-print, --dry-run    same as --script=-
>                 --max-errors=N             stop after this number of errors
>                 --skip-noaccess            don't try to transfer files with no read access.
>                 --use-cache                use cached directory listings
>                 --Remove-source-files      remove  source files after transfer (use with cau
>                                            tion)
>                 --Remove-source-dirs       remove source files and directories after transfer
>                                            (use  with  caution).   Top level directory is not
>                                            removed if it's name ends with a slash.
>                 --Move                     same as --Remove-source-dirs
>        -a                                  same as --allow-chown --allow-suid --no-umask
> RX is an extended regular expression, just like in egrep(1).
>
> GP is a glob pattern, e.g. `*.zip'.
>
> Include and exclude options can be specified multiple times. It means that a file  or  direc
> tory  would  be  mirrored  if  it matches an include and does not match to excludes after the
> include, or does not match anything and the first check is exclude. Directories  are  matched
> with a slash appended.
>
> Note  that symbolic links are not created when uploading to remote server, because FTP proto
> col cannot do it. To upload files the links refer to, use `mirror -RL'  command  (treat  sym
> bolic links as files).
>
> For options --newer-than and --older-than you can either specify a file or time specification
> like that used by at(1) command, e.g.  \`now-7days' or \`week ago'. If you specify a file, then
> modification time of that file will be used.
>
> Verbosity  level  can be selected using --verbose=level option or by several -v options, e.g.
> -vvv. Levels are:
>        0 - no output (default)
>        1 - print actions
>        2 - +print not deleted file names (when -e is not specified)
>        3 - +print directory names which are mirrored
>
> --only-newer turns off file size comparison and uploads/downloads only newer  files  even  if
> size is different. By default older files are transferred and replace newer ones.
>
> --upload-older  allows  replacing newer remote files with older ones (when the target side is
> remote). Some remote back-ends cannot preserve timestamps so the default  is  to  keep  newer
> files.
>
> Recursion  mode  can be one of \`always', \`never', \`missing', \`newer'. With the option \`newer'
> mirror compares timestamps of directories and enters a directory only if it is older or missing
> on  the  target side. Be aware that when a file changes the directory timestamp may stay
> the same, so mirror won't process that directory.
>
> The options --file and --directory may be used multiple times and even  mixed  provided  that
> base directories of the paths are the same.
>
> You  can mirror between two servers if you specify URLs instead of directories.  FXP is automatically
> used for transfers between FTP servers, if possible.
>
> Some FTP servers hide dot-files by default (e.g. .htaccess), and show  them  only  when  LIST
> command is used with -a option. In such case try to use `set ftp:list-options -a'.
>
> The  recursion  modes  \`newer'  and  \`missing' conflict with --scan-all-first, --depth-first,
> --no-empty-dirs and setting mirror:no-empty-dirs=true.


## `mput` command

`mput [-c] [-d] [-a] [-E] [-e] [-P N] [-O base] files`

> Upload files with wildcard expansion. By default it uses the  base  name  of  local  name  as
> remote one. This can be changed by `-d' option.
>
>        -c          continue, reput
>        -d          create  directories  the same as in file names and put the files into them
>                    instead of current directory
>        -E          delete source files after successful transfer (dangerous)
>        -e          delete target file before the transfer
>        -a          use ascii mode (binary is the default)
>        -P N        upload N files in parallel
>        -O <base>   specifies base directory or URL where files should be placed


## `put` command

`put [-E] [-a] [-c] [-e] [-P N] [-O base] lfile [-o rfile]`

> Upload lfile with remote name rfile. If -o omitted, the base name of lfile is used as  remote
> name. Does not expand wildcards, use mput for that.
>
>        -o <rfile>   specifies remote file name (default - basename of lfile)
>        -c           continue, reput. It requires permission to overwrite remote files
>        -E           delete source files after successful transfer (dangerous)
>        -e           delete target file before the transfer
>        -a           use ascii mode (binary is the default)
>        -P N         upload N files in parallel
