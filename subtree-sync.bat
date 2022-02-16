# sync %repo%
SET repo=schcal
git subtree add --prefix=packages/%repo% git@github.com:snomiao/%repo% master --squash || ^
git subtree pull --prefix=packages/%repo% git@github.com:snomiao/%repo% master --squash
git subtree push --prefix=packages/%repo% git@github.com:snomiao/%repo% master

SET repo=go-to-sleep
git subtree add --prefix=packages/%repo% git@github.com:snomiao/%repo% master --squash || ^
git subtree pull --prefix=packages/%repo% git@github.com:snomiao/%repo% master --squash
git subtree push --prefix=packages/%repo% git@github.com:snomiao/%repo% master

SET repo=warehouse
git subtree add --prefix=packages/%repo% git@github.com:snomiao/%repo% master --squash || ^
git subtree pull --prefix=packages/%repo% git@github.com:snomiao/%repo% master --squash
git subtree push --prefix=packages/%repo% git@github.com:snomiao/%repo% master
