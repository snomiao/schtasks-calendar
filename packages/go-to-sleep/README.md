# Auto sleep your PC at 19:30

I need someone to tell me it's time to sleep. But are you the one? Obviously not. haha!

## Install
```
schtask-add.bat
```

## Q&A

### Q: How to uninstall?
   A: Run [schtask-remove.bat](./schtask-remove.bat)

### Q: What is `The request is not supported.(50)`
   A: Try run `powercfg -h -size on`, [or CLICK HERE to see details](https://superuser.com/questions/950864/windows-10-hibernation-not-available)

### Q: How it works?
   A: Just a simple command in this file..

`./go-to-sleep.bat`
> ```
> shutdown -h
> ```

## About
version: (20200508)
author: snomiao@gmail.com
