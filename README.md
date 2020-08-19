
## Get Started

Google calendar events that contains a markdown link will be sync to windows schedule tasks then the link will open automatically on time on your PC.

### Run by command.

```sh
npx schcal https://calendar.google.com/calendar/ical/xxxxxxxxxxxxxxxxxxx/private-cxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/basic.ics

```

or

```sh
npm i schtasks-calendar -g
schcal https://calendar.google.com/calendar/ical/xxxxxxxxxxxxxxxxxxx/private-cxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/basic.ics
```

### Run by `config.yaml`

```yaml
# 
ICS_URLS:
  # snomiao
  - https://calendar.google.com/calendar/ical/snomiao%40gmail.com/private-d772b2790a1a73de26afb64188c5ca0a/basic.ics
  # a calendar
  - https://calendar.google.com/calendar/ical/xxxxxxxxxxxxxxxxxxx/private-cxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/basic.ics
  # another calendar
  - https://calendar.google.com/calendar/ical/xxxxxxxxxxxxxxxxxxx/private-cxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/basic.ics

# Optional, if you want cache the ... defaults to 0 (don't use cache and never safe a cache file)
CACHE_TIMEOUT: 3600e3

# Optional, if you need a proxy to access google... Or you can delete this line. defaults to empty
HTTP_PROXY: http://localhost:1080

# Optional, how many days events will add to schtasks, defaults to 7 (then you can run me weekly)
FORWARD_DAYS: 7
```

### Setup schtasks auto update (daily or whatever)

Run `add-to-schtasks.bat`

## References

- [schtasks | Microsoft Docs]( https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/schtasks )
- [手把手教你使用nodejs编写cli(命令行) - 掘金]( https://juejin.im/post/6844903702453551111 )
- [PC Automation - IFTTT]( https://ifttt.com/applets/190903p-pc-automation )